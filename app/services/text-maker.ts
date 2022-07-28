import Service from '@ember/service'
import * as opentype from 'opentype.js'
import * as THREE from 'three'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'
import config from 'text2stl/config/environment'
import { generateSupportShape } from 'text2stl/misc/support-shape-generation'

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

type SingleGlyphDef = {
  paths: THREE.Path[]
  holes: THREE.Path[]
}

type MultipleGlyphDef= {
  glyphs: SingleGlyphDef[]
  bounds: {
    min: { x: number, y: number },
    max: { x: number, y: number }
  }
}

export default class TextMakerService extends Service {

  private glyphToShapes(glyph: opentype.Glyph, scale: number, xOffset: number, yOffset: number): SingleGlyphDef {

    // Easy scale & move each point of the glyph according to args
    let coord = function(x: number, y: number): [number, number] {
      return [
        x * scale + xOffset,
        y * scale + yOffset
      ]
    }

    glyph.getMetrics()
    let paths: THREE.Path[] = []
    let holes: THREE.Path[] = []
    for (let contour of (glyph.getContours() as Contour[])) {
      let path = new THREE.Path()
      let prev: ContourPoint|null = null
      let curr = contour[contour.length - 1]
      let next = contour[0]
      if (curr.onCurve) {
        path.moveTo(...coord(curr.x, curr.y))
      } else {
        if (next.onCurve) {
          path.moveTo(...coord(next.x, next.y))
        } else {
          let start = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5 }
          path.moveTo(...coord(start.x, start.y))
        }
      }

      for (let i = 0; i < contour.length; ++i) {
        prev = curr
        curr = next
        next = contour[(i + 1) % contour.length]
        if (curr.onCurve) {
          path.lineTo(...coord(curr.x, curr.y))
        } else {
          let prev2 = prev
          let next2 = next
          if (!prev.onCurve) {
            prev2 = { x: (curr.x + prev.x) * 0.5, y: (curr.y + prev.y) * 0.5, onCurve: false }
            path.lineTo(...coord(prev2.x, prev2.y))
          }

          if (!next.onCurve) {
            next2 = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5, onCurve: false }
          }

          path.lineTo(...coord(prev2.x, prev2.y))
          path.quadraticCurveTo(
            ...coord(curr.x, curr.y),
            ...coord(next2.x, next2.y)
          )
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
        paths.push(path)
      }
    }

    return {
      paths,
      holes
    }
  }

  private glyphsDefToGeometry(depth: number, glyphsDef: MultipleGlyphDef): THREE.BufferGeometry {

    let geometries: THREE.ExtrudeGeometry[] = []

    for (let glyphDef of glyphsDef.glyphs) {

      let shapes = glyphDef.paths.map(function(path) {
        let shape = new THREE.Shape()
        shape.add(path)
        shape.holes = glyphDef.holes
        return shape
      })

      let geometry = new THREE.ExtrudeGeometry(shapes, {
        depth,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0
      })

      geometries.push(geometry)
    }

    return mergeBufferGeometries(geometries.flat())
  }

  private stringToGlyhpsDef(params: TextMakerParameters): MultipleGlyphDef {
    let { font } = params

    let text = params.text || textMakerDefault.text
    let size = params.size !== undefined && params.size >= 0
      ? params.size
      : textMakerDefault.size
    let spacing = params.spacing !== undefined ? params.spacing : textMakerDefault.spacing
    let vSpacing = params.vSpacing !== undefined ? params.vSpacing : textMakerDefault.vSpacing
    let alignment = params.alignment !== undefined ? params.alignment : textMakerDefault.alignment

    let scale = 1 / font.unitsPerEm * size

    let glyphShapes: SingleGlyphDef[] = []
    // to handle alignment
    let linesWidth: number[] = []
    let bounds = {
      min: { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER },
      max: { x: 0, y: 0 }
    }

    let lines = text.split('\n').map((s) => s.trimEnd())
    let dy = 0

    // Iterate a first time on all lines to calculate line width (text align)
    for (let lineText of lines) {

      let dx = 0
      let lineMaxX = 0
      font.forEachGlyph(lineText, 0, 0, size, undefined, (glyph, x, y) => {
        x += dx
        dx += spacing
        let glyphBounds = glyph.getBoundingBox()

        lineMaxX = x + glyphBounds.x2 * scale

        bounds.min.x = Math.min(bounds.min.x, x + glyphBounds.x1 * scale)
        bounds.min.y = Math.min(bounds.min.y, y - dy + glyphBounds.y1 * scale)
        bounds.max.x = Math.max(bounds.max.x, x + glyphBounds.x2 * scale)
        bounds.max.y = Math.max(bounds.max.y, y - dy + glyphBounds.y2 * scale)

      })

      dy += size + vSpacing

      // Keep this for each line to handle alignment
      linesWidth.push(lineMaxX)
    }

    let linesAlignOffset = linesWidth.map(() => 0)

    // Handle alignment (now we know all line size)
    if (alignment !== 'left') {
      let maxWidth = Math.max(...linesWidth)

      linesWidth.forEach(function(lineWidth, line) {
        if (lineWidth !== maxWidth) {
          let xOffset = (maxWidth - lineWidth) / (alignment === 'center' ? 2 : 1)
          linesAlignOffset[line] = xOffset
        }
      })
    }

    dy = 0
    for (let lineIndex in lines) {

      let lineText = lines[lineIndex]
      let dx = 0

      // Iterate on text char to generate a Geometry for each
      font.forEachGlyph(lineText, 0, 0, size, undefined, (glyph, x, y) => {
        x += dx + linesAlignOffset[lineIndex]

        glyphShapes.push(
          this.glyphToShapes(
            glyph,
            scale, // scale
            x, // x offset
            y - dy // y offset
          )
        )
        dx += spacing
      })

      dy += size + vSpacing
    }

    return {
      glyphs: glyphShapes,
      bounds
    }
  }

  private generateSupportShape(width: number, height: number, radius: number, handleSettings: Handle | undefined): THREE.Shape {
    return generateSupportShape(width, height, radius, handleSettings)
  }

  private translatePath(path: THREE.Path, x: number, y :number) {
    return new THREE.Path(path.getPoints().map((p) => {
      return new THREE.Vector2(p.x + x, p.y + y)
    }))
  }

  generateMesh(params: TextMakerParameters): THREE.Mesh {
    let type = params.type || ModelType.TextOnly

    let textDepth = params.height !== undefined && params.height >= 0
      ? params.height
      : textMakerDefault.height

    let plyghsDef = this.stringToGlyhpsDef(params)
    let supportShape: THREE.Shape | undefined = undefined

    let finalGeometry: THREE.BufferGeometry

    let { min, max } = plyghsDef.bounds
    let size  = {
      x: max.x - min.x,
      y: max.y - min.y,
      z: textDepth
    }

    // Support settings
    let supportDepth = params.supportHeight || textMakerDefault.supportHeight
    let supportPadding = params.supportPadding !== undefined ? params.supportPadding : textMakerDefault.supportPadding
    let supportWidth = size.x + supportPadding.left + supportPadding.right
    let supportHeight = size.y + supportPadding.top + supportPadding.bottom
    let supportBorderRadius = params.supportBorderRadius !== undefined ? params.supportBorderRadius : textMakerDefault.supportBorderRadius

    if (type !== ModelType.TextOnly) {
      // Generate support
      supportShape = this.generateSupportShape(
        supportWidth,
        supportHeight,
        supportBorderRadius,
        params.handleSettings
      )
    }

    if (type === ModelType.NegativeText) {

      // Ensure support height is equal or greater than text height
      if (supportDepth < size.z) {
        supportDepth += size.z - supportDepth
      }

      let moveTextX = -min.x + supportPadding.left
      let moveTextY = -min.y + supportPadding.bottom

      let supportGeometry: THREE.ExtrudeBufferGeometry | undefined

      if (supportDepth > textDepth) {
        let plainSupportDepth = supportDepth - textDepth

        supportGeometry = new THREE.ExtrudeGeometry(supportShape, {
          depth: plainSupportDepth,
          bevelEnabled: true,
          bevelThickness: 0,
          bevelSize: 0,
          bevelOffset: 0,
          bevelSegments: 0
        })
      }

      // extract glyph path & move them according to support padding
      let glyphsPaths = plyghsDef.glyphs.map((g) => g.paths).flat().map((p) => this.translatePath(p, moveTextX, moveTextY))
      let glyphsHolesPaths = plyghsDef.glyphs.map((g) => g.holes).flat().map((p) => this.translatePath(p, moveTextX, moveTextY))

      // Add Glyph paths as hole in support & extrude
      supportShape?.holes.push(...glyphsPaths)
      let negativeTextGeometry = new THREE.ExtrudeGeometry(supportShape, {
        depth: textDepth,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0
      })

      // Extrude glyph holes as geometry
      let glyphsHolesShapes = glyphsHolesPaths.map(function(path) {
        let s = new THREE.Shape()
        s.add(path)
        return s
      })
      let negativeTextHoleGeometry = new THREE.ExtrudeGeometry(glyphsHolesShapes, {
        depth: textDepth,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0
      })

      if (supportDepth > textDepth) {
        // Move negative text
        negativeTextGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(
          0,
          0,
          supportDepth - textDepth
        ))
        negativeTextHoleGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(
          0,
          0,
          supportDepth - textDepth
        ))
      }

      let geometries = [
        negativeTextGeometry,
        negativeTextHoleGeometry
      ]
      if (supportGeometry) {
        geometries.push(supportGeometry)
      }

      finalGeometry = mergeBufferGeometries(geometries)
    } else {

      let textGeometry = this.glyphsDefToGeometry(textDepth, plyghsDef)

      if (type !== ModelType.TextOnly) {
        let supportGeometry = new THREE.ExtrudeGeometry(supportShape, {
          depth: supportDepth,
          bevelEnabled: true,
          bevelThickness: 0,
          bevelSize: 0,
          bevelOffset: 0,
          bevelSegments: 0
        })

        if (type === ModelType.TextWithSupport) {
          // Move text in support according to padding settings
          textGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(
            -min.x + supportPadding.left,
            -min.y + supportPadding.bottom,
            supportDepth
          ))
        } else if (type === ModelType.VerticalTextWithSupport) {

          // Rotate & move text
          textGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(
            Math.PI / 2
          ))
          textGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(
            supportPadding.left,
            supportPadding.bottom + size.z * 2,
            supportDepth
          ))
        }

        finalGeometry = mergeBufferGeometries([
          supportGeometry,
          textGeometry
        ])
      } else {
        finalGeometry = textGeometry
      }
    }

    return new THREE.Mesh(
      finalGeometry,
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
