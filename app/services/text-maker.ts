import Service from '@ember/service'
import * as opentype from 'opentype.js'
import { THREE, ExtendedMesh } from 'enable3d'
import { CSG } from '@enable3d/three-graphics/jsm/csg'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'
import config from 'text2stl/config/environment'
const {
  APP: { textMakerDefault, threePreviewSettings: { meshParameters } }
} = config

interface ContourPoint {
  x: number
  y: number
  onCurve: boolean
}

export type TextMakerAlignment = 'left' | 'center' | 'right'

export type SupportPadding = {
  top: number
  bottom: number
  left: number
  right: number
}

export type Handle = {
  type: 'hole' | 'handle' | 'none'
  position: 'left' | 'top' | 'right' | 'bottom'
  size: number
  size2: number
  offsetX: number
  offsetY: number
}

export interface TextMakerParameters {
  font: opentype.Font
  text: string
  size?: number
  height?: number
  spacing?: number
  vSpacing?: number
  alignment?: TextMakerAlignment
  type?: ModelType
  supportHeight?: number
  supportPadding?: SupportPadding
  supportBorderRadius?: number
  handleSettings?: Handle
}

export enum ModelType {
  TextOnly = 1,
  TextWithSupport = 2,
  NegativeText = 3,
  VerticalTextWithSupport = 4
}

type Contour = ContourPoint[]

export default class TextMakerService extends Service {

  private glyphToShapes(glyph: opentype.Glyph): THREE.Shape[] {
    glyph.getMetrics()
    let shapes: THREE.Shape[] = []
    let holes: THREE.Path[] = []
    for (let contour of (glyph.getContours() as Contour[])) {
      let path = new THREE.Path()
      let prev: ContourPoint|null = null
      let curr = contour[contour.length - 1]
      let next = contour[0]
      if (curr.onCurve) {
        path.moveTo(curr.x, curr.y)
      } else {
        if (next.onCurve) {
          path.moveTo(next.x, next.y)
        } else {
          let start = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5 }
          path.moveTo(start.x, start.y)
        }
      }

      for (let i = 0; i < contour.length; ++i) {
        prev = curr
        curr = next
        next = contour[(i + 1) % contour.length]
        if (curr.onCurve) {
          path.lineTo(curr.x, curr.y)
        } else {
          let prev2 = prev
          let next2 = next
          if (!prev.onCurve) {
            prev2 = { x: (curr.x + prev.x) * 0.5, y: (curr.y + prev.y) * 0.5, onCurve: false }
            path.lineTo(prev2.x, prev2.y)
          }

          if (!next.onCurve) {
            next2 = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5, onCurve: false }
          }

          path.lineTo(prev2.x, prev2.y)
          path.quadraticCurveTo(curr.x, curr.y, next2.x, next2.y)
        }
      }

      path.closePath()
      let sum = 0
      let lastPoint = contour[contour.length - 1]
      for (let point of contour) {
        sum += (lastPoint.x - point.x) * (point.y + lastPoint.y)
        lastPoint = point
      }

      if (sum > 0) {
        holes.push(path)
      } else {
        let shape = new THREE.Shape()
        shape.add(path)
        shapes.push(shape)
      }
    }

    for (let shape of shapes) {
      shape.holes = holes
    }

    return shapes
  }

  private stringToGeometry(params: TextMakerParameters): THREE.BufferGeometry {
    let { font } = params

    let text = params.text || textMakerDefault.text
    let size = params.size !== undefined && params.size >= 0
      ? params.size
      : textMakerDefault.size
    let height = params.height !== undefined && params.height >= 0
      ? params.height
      : textMakerDefault.height
    let spacing = params.spacing !== undefined ? params.spacing : textMakerDefault.spacing
    let vSpacing = params.vSpacing !== undefined ? params.vSpacing : textMakerDefault.vSpacing
    let alignment = params.alignment !== undefined ? params.alignment : textMakerDefault.alignment

    let geometries: THREE.ExtrudeGeometry[][] = []
    let dy = 0
    let linesWidth: number[] = []
    let lines = text.split('\n').map((s) => s.trimEnd())
    for (let lineText of lines) {

      let dx = 0
      let lineMaxX = 0
      let lineGeometries: THREE.ExtrudeGeometry[] = []

      // Iterate on text char to generate a Geometry for each
      font.forEachGlyph(lineText, 0, 0, size, undefined, (glyph, x, y) => {
        x += dx
        dx += spacing

        y += dy

        let shapes = this.glyphToShapes(glyph)
        let geometry = new THREE.ExtrudeGeometry(shapes, {
          depth: height,
          bevelEnabled: true,
          bevelThickness: 0,
          bevelSize: 0,
          bevelOffset: 0,
          bevelSegments: 0
        })
        geometry.applyMatrix4(new THREE.Matrix4().makeScale(
          1 / font.unitsPerEm * size,
          1 / font.unitsPerEm * size,
          1
        ))

        geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(x, y, 0))
        lineGeometries.push(geometry)

        // compute bound box to retrieve glyph size
        geometry.computeBoundingBox()
        lineMaxX = geometry.boundingBox?.max.x ?? 0
      })

      geometries.push(lineGeometries)

      dy -= size + vSpacing

      // Keep this for each line to handle alignment
      linesWidth.push(lineMaxX)
    }

    // Handle alignment (now we know all line size)
    if (alignment !== 'left') {
      let maxWidth = Math.max(...linesWidth)

      linesWidth.forEach(function(lineWidth, line) {
        if (lineWidth !== maxWidth) {
          let xOffset = (maxWidth - lineWidth) / (alignment === 'center' ? 2 : 1)
          geometries[line].forEach(function(geometry) {
            geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(xOffset, 0, 0))
          })
        }
      })
    }

    return mergeBufferGeometries(geometries.flat())
  }

  private generateSupport(width: number, height: number, depth: number, radius: number): THREE.BufferGeometry {

    // Limit min/max radius
    let maxRadius = Math.min(width / 2, height / 2)
    if (radius > maxRadius) {
      radius = maxRadius
    } else if (radius < 0) {
      radius = 0
    }

    let supportShape = new THREE.Shape()
    supportShape.moveTo(width - radius, 0)
    supportShape.lineTo(width - radius, 0)
    if (radius) {
      supportShape.ellipse(
        0,
        radius,
        radius,
        radius,
        Math.PI / 2,
        Math.PI,
        false,
        Math.PI
      )
    }

    supportShape.lineTo(width, height - radius)
    if (radius) {
      supportShape.ellipse(
        -radius,
        0,
        radius,
        radius,
        Math.PI,
        Math.PI * 1.5,
        false,
        Math.PI
      )
    }

    supportShape.lineTo(radius, height)
    if (radius) {
      supportShape.ellipse(
        0,
        -radius,
        radius,
        radius,
        Math.PI * 1.5,
        0,
        false,
        Math.PI
      )
    }

    supportShape.lineTo(0, radius)
    if (radius) {
      supportShape.ellipse(
        radius,
        0,
        radius,
        radius,
        0,
        Math.PI / 2,
        false,
        Math.PI
      )
    }

    let extrudeSettings = {
      depth,
      bevelEnabled: true,
      bevelThickness: 0,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 0
    }
    return new THREE.ExtrudeGeometry(supportShape, extrudeSettings)
  }

  private generateHandle(handleSize: number, handleSize2: number, handleDepth: number): THREE.BufferGeometry {
    let supportShape = new THREE.Shape()
    supportShape.moveTo(0, 0)
    supportShape.lineTo(handleSize2, 0)

    supportShape.ellipse(
      handleSize / 2,
      0,
      handleSize / 2,
      handleSize / 2,
      0,
      Math.PI,
      true,
      Math.PI
    )

    supportShape.lineTo(handleSize + handleSize2 * 2, 0)

    supportShape.ellipse(
      -handleSize / 2 - handleSize2,
      0,
      handleSize / 2 + handleSize2,
      handleSize / 2 + handleSize2,
      0,
      Math.PI,
      false,
      0
    )

    let extrudeSettings = {
      depth: handleDepth,
      bevelEnabled: true,
      bevelThickness: 0,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 0
    }
    return new THREE.ExtrudeGeometry(supportShape, extrudeSettings)
  }

  // Compute (merge or substract) text, support handle & hole in a single geometry
  private mixMeshComponents(type: ModelType, textGeometry: THREE.BufferGeometry, supportGeometry: THREE.BufferGeometry | undefined, holeGeometry: THREE.BufferGeometry | undefined, handleGeometry: THREE.BufferGeometry | undefined): THREE.BufferGeometry {

    if (type === ModelType.NegativeText && supportGeometry) {

      let intermediareSupport = supportGeometry
      if (holeGeometry) {
        let bspSupport = CSG.subtract(
          new ExtendedMesh(
            supportGeometry,
            new THREE.MeshNormalMaterial()
          ),
          new ExtendedMesh(
            holeGeometry,
            new THREE.MeshNormalMaterial()
          )
        )
        intermediareSupport = bspSupport.geometry
      } else if (handleGeometry) {
        intermediareSupport = mergeBufferGeometries([
          supportGeometry,
          handleGeometry
        ])
      }

      // Substract text to support
      let bspFinal = CSG.subtract(
        new ExtendedMesh(
          intermediareSupport,
          new THREE.MeshNormalMaterial()
        ),
        new ExtendedMesh(
          textGeometry,
          new THREE.MeshNormalMaterial()
        )
      )

      return bspFinal.geometry

    } else if (type === ModelType.TextOnly) {

      if (handleGeometry) {
        // Merge support with text
        return mergeBufferGeometries([
          textGeometry,
          handleGeometry
        ], false)

      } else if (holeGeometry) {
        // Substract hole to text
        let bspFinal = CSG.subtract(
          new ExtendedMesh(
            textGeometry,
            new THREE.MeshNormalMaterial()
          ),
          new ExtendedMesh(
            holeGeometry,
            new THREE.MeshNormalMaterial()
          )
        )
        return bspFinal.geometry
      }
    } else if (supportGeometry) {

      if (handleGeometry) {

        // Merge support with text & handle
        return mergeBufferGeometries([
          textGeometry,
          handleGeometry,
          supportGeometry
        ], false)

      } else if (holeGeometry) {

        let intermediareGeometry = mergeBufferGeometries([
          textGeometry,
          supportGeometry
        ], false)

        let bspFinal = CSG.subtract(
          new ExtendedMesh(
            intermediareGeometry,
            new THREE.MeshNormalMaterial()
          ),
          new ExtendedMesh(
            holeGeometry,
            new THREE.MeshNormalMaterial()
          )
        )
        return bspFinal.geometry
      } else {
        return mergeBufferGeometries([
          textGeometry,
          supportGeometry
        ], false)
      }
    }

    return textGeometry
  }

  generateMesh(params: TextMakerParameters): THREE.Mesh {
    let type = params.type || ModelType.TextOnly

    // Mesh will be generate by combination of these Geometries
    let textGeometry = this.stringToGeometry(params)
    let supportGeometry: THREE.BufferGeometry | undefined = undefined
    let holeGeometry: THREE.BufferGeometry | undefined = undefined
    let handleGeometry: THREE.BufferGeometry | undefined = undefined

    // Generate mesh in order to get size.
    // TODO: refactor if size can be calculate from geometry.
    let textMesh = new ExtendedMesh(
      textGeometry,
      new THREE.MeshLambertMaterial({
        ...meshParameters,
        side: THREE.DoubleSide
      })
    )

    // Get size of text part
    let { min, max } = new THREE.Box3().setFromObject(textMesh)
    let size  = {
      x: max.x - min.x,
      y: max.y - min.y,
      z: max.z - min.z
    }

    // Support settings
    let supportDepth = params.supportHeight || textMakerDefault.supportHeight
    let supportPadding = params.supportPadding !== undefined ? params.supportPadding : textMakerDefault.supportPadding
    let supportWidth = size.x + supportPadding.left + supportPadding.right
    let supportHeight = size.y + supportPadding.top + supportPadding.bottom
    let supportBorderRadius = params.supportBorderRadius !== undefined ? params.supportBorderRadius : textMakerDefault.supportBorderRadius

    if (type === ModelType.TextWithSupport) {

      // Generate support
      supportGeometry = this.generateSupport(supportWidth, supportHeight, supportDepth, supportBorderRadius)

      // Move text in support according to padding settings
      textGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(
        -min.x + supportPadding.left,
        -min.y + supportPadding.bottom,
        supportDepth
      ))
    } else if (type === ModelType.VerticalTextWithSupport) {
      // Generate support
      supportGeometry = this.generateSupport(supportWidth, supportHeight, supportDepth, supportBorderRadius)

      // Rotate & move text
      textGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(
        Math.PI / 2
      ))
      textGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(
        supportPadding.left,
        supportPadding.bottom + size.z * 2,
        supportDepth
      ))

    } else if (type === ModelType.NegativeText) {
      // Ensure support height is equal or greater than text height
      if (supportDepth < size.z) {
        supportDepth += size.z - supportDepth
      }

      // Generate support
      supportGeometry = this.generateSupport(supportWidth, supportHeight, supportDepth, supportBorderRadius)

      // Move text in support according to padding settings
      textGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(
        -min.x + supportPadding.left,
        -min.y + supportPadding.bottom,
        supportDepth - size.z
      ))
    }

    // Generate handle/hole if needed
    if (params.handleSettings?.type && params.handleSettings.type !== 'none') {

      let { offsetX, offsetY, size: handleSize, size2: handleSize2, position, type: handleType } = params.handleSettings

      let handleX = 0
      let handleY = 0

      switch (position) {
        case 'top':
          handleX = (type === ModelType.TextOnly ? size.x : supportWidth) / 2
          handleY = type === ModelType.TextOnly ? size.y : supportHeight
          break
        case 'bottom':
          handleX = (type === ModelType.TextOnly ? size.x : supportWidth) / 2
          break
        case 'left':
          handleY = (type === ModelType.TextOnly ? size.y : supportHeight) / 2
          break
        case 'right':
          handleX = type === ModelType.TextOnly ? size.x : supportWidth
          handleY = (type === ModelType.TextOnly ? size.y : supportHeight) / 2
          break
      }

      if (handleType === 'hole') {

        let holeHeight = 0
        if (type === ModelType.TextOnly) {
          holeHeight  = size.z
        } else if (type === ModelType.NegativeText || type === ModelType.VerticalTextWithSupport) {
          holeHeight = supportDepth
        } else {
          holeHeight = supportDepth + size.z
        }

        holeGeometry = new THREE.CylinderGeometry(
          handleSize,
          handleSize,
          holeHeight,
          32
        )

        holeGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(
          Math.PI / 2
        ))

        holeGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(
          handleX + offsetX,
          handleY + offsetY,
          holeHeight / 2
        ))
      } else if (handleType === 'handle') {

        handleGeometry = this.generateHandle(handleSize, handleSize2, supportDepth)

        let handleRotation = undefined
        switch (position) {
          case 'top':
            offsetX -= (handleSize + handleSize2 * 2) / 2
            break
          case 'bottom':
            handleRotation = Math.PI
            offsetX += (handleSize + handleSize2 * 2) / 2
            break
          case 'left':
            handleRotation = Math.PI / 2
            offsetY -= (handleSize + handleSize2 * 2) / 2
            break
          case 'right':
            handleRotation = -Math.PI / 2
            offsetY += (handleSize + handleSize2 * 2) / 2
            break
        }

        if (handleRotation) {
          handleGeometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(
            handleRotation
          ))
        }

        handleGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(
          handleX + offsetX,
          handleY + offsetY,
          0
        ))
      }
    }

    return new ExtendedMesh(
      // "Combine" all geometries into one
      this.mixMeshComponents(
        type,
        textGeometry,
        supportGeometry,
        holeGeometry,
        handleGeometry
      ),
      new THREE.MeshLambertMaterial({
        ...meshParameters,
        side: THREE.DoubleSide
      })
    )
  }
}

declare module '@ember/service' {
  interface Registry {
    'text-maker': TextMakerService
  }
}
