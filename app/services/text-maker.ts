import Service from '@ember/service'
import * as opentype from 'opentype.js'
import * as THREE from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils'

export interface ContourPoint {
  x: number
  y: number
  onCurve: boolean
}

export interface TextMakerParameters {
  font: opentype.Font
  text: string
  size?: number
  width?: number
  kerning?: number|number[]
}
export type Contour = ContourPoint[]

export default class TextMaker extends Service {

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

  stringToGeometry(params: TextMakerParameters): THREE.BufferGeometry {
    let { font, text } = params

    let size = params.size ?? 72
    let width = params.width ?? 20
    let kerning = params.kerning ?? 10

    let geometries: THREE.ExtrudeGeometry[] = []
    let dx = 0

    // Iterate on text char to generate a Geometry for each
    font.forEachGlyph(text, 0, 0, size, undefined, (glyph, x, y) => {
      x += dx
      if (typeof kerning === 'number') {
        dx += kerning
      } else if (Array.isArray(kerning) && kerning.length > 0) {
        dx += kerning.shift()!
      }

      let shapes = this.glyphToShapes(glyph)
      let geometry = new THREE.ExtrudeGeometry(shapes, {
        depth: width,
        steps: 1
        // bevelEnabled: true,
        // bevelSize: 5,
        // bevelThickness: 20,
        // bevelSegments: 10,
        // bevelOffset: 0,
      })
      geometry.applyMatrix4(new THREE.Matrix4().makeScale(1 / font.unitsPerEm * size, 1 / font.unitsPerEm * size, 1))
      geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(x, y, 0))
      geometries.push(geometry)
    })

    return BufferGeometryUtils.mergeBufferGeometries(geometries)
  }
}

declare module '@ember/service' {
  interface Registry {
    'text-maker': TextMaker
  }
}
