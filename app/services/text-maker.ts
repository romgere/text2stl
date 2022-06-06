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

    // Support radius "stuff"
    let supportRadiusOffset = 1 // Should be calculated ?
    let maxRadius = Math.min(width / 2, height / 2)
    if (radius > maxRadius) {
      radius = maxRadius
    }

    let supportShape = new THREE.Shape()
    supportShape.moveTo(width - radius, 0)
    supportShape.lineTo(width - radius, 0)
    if (radius) {
      supportShape.bezierCurveTo(
        width - radius, 0,
        width - supportRadiusOffset, supportRadiusOffset,
        width, radius
      )
    }

    supportShape.lineTo(width, height - radius)
    if (radius) {
      supportShape.bezierCurveTo(
        width, height - radius,
        width - supportRadiusOffset, height - supportRadiusOffset,
        width - radius, height
      )
    }

    supportShape.lineTo(radius, height)
    if (radius) {
      supportShape.bezierCurveTo(
        radius, height,
        supportRadiusOffset, height - supportRadiusOffset,
        0, height - radius
      )
    }

    supportShape.lineTo(0, radius)
    if (radius) {
      supportShape.bezierCurveTo(
        0, radius,
        supportRadiusOffset, supportRadiusOffset,
        radius, 0
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

  generateMesh(params: TextMakerParameters): THREE.Mesh {
    let type = params.type || ModelType.TextOnly

    let textGeometry = this.stringToGeometry(params)
    // Generate mesh in order to get size.
    // TODO: refactor if size can be calculate from geometry.
    let textMesh = new ExtendedMesh(
      textGeometry,
      new THREE.MeshLambertMaterial({
        ...meshParameters,
        side: THREE.DoubleSide
      })
    )

    if (type === ModelType.TextOnly) {
      return textMesh
    }

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
    let supportBorderRadius = params.supportBorderRadius || textMakerDefault.supportBorderRadius

    let finalGeometry : THREE.BufferGeometry | undefined = undefined

    if (type === ModelType.TextWithSupport) {

      // Generate support
      let supportGeometry = this.generateSupport(supportWidth, supportHeight, supportDepth, supportBorderRadius)

      // Move text in support according to padding settings
      textGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(
        supportPadding.left,
        supportPadding.bottom,
        supportDepth
      ))

      // Merge
      finalGeometry = mergeBufferGeometries([
        supportGeometry.toNonIndexed(),
        textGeometry
      ], true)

    } else if (type === ModelType.VerticalTextWithSupport) {
      // Generate support
      let supportGeometry = this.generateSupport(supportWidth, supportHeight, supportDepth, supportBorderRadius)

      // Rotate & move text
      textGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(
        Math.PI / 2
      ))
      textGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(
        supportPadding.left,
        supportPadding.bottom + size.z * 2,
        supportDepth
      ))
      // Merge
      finalGeometry = mergeBufferGeometries([
        supportGeometry.toNonIndexed(),
        textGeometry
      ], true)
    } else if (type === ModelType.NegativeText) {
      // Ensure support height is equal or greater than text height
      if (supportDepth < size.z) {
        supportDepth += size.z - supportDepth
      }

      // Generate support
      let supportGeometry = this.generateSupport(supportWidth, supportHeight, supportDepth, supportBorderRadius)

      // Move text in support according to padding settings
      textGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(
        supportPadding.left,
        supportPadding.bottom,
        supportDepth - size.z
      ))

      // Substract text to support
      let bspSupport = CSG.subtract(
        new ExtendedMesh(
          supportGeometry,
          new THREE.MeshNormalMaterial()
        ),
        textMesh
      )
      finalGeometry = bspSupport.geometry
    }

    return new ExtendedMesh(
      finalGeometry || textGeometry,
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
