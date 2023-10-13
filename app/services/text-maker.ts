import Service from '@ember/service';
import * as opentype from 'opentype.js';
import * as THREE from 'three';
import { mergeBufferGeometries } from 'text2stl/utils/BufferGeometryUtils';
import config from 'text2stl/config/environment';
import { generateSupportShape } from 'text2stl/misc/support-shape-generation';

const {
  APP: {
    textMakerDefault,
    threePreviewSettings: { meshParameters },
  },
} = config;

export type TextMakerAlignment = 'left' | 'center' | 'right';
export type TextMakerVerticalAlignment = 'default' | 'top' | 'bottom';

export type SupportPadding = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type Handle = {
  type: 'hole' | 'handle' | 'none';
  position: 'left' | 'top' | 'right' | 'bottom';
  size: number;
  size2: number;
  offsetX: number;
  offsetY: number;
};

export interface TextMakerParameters {
  text: string;
  size?: number;
  height?: number;
  spacing?: number;
  vSpacing?: number;
  alignment?: TextMakerAlignment;
  vAlignment?: TextMakerVerticalAlignment;
  type?: ModelType;
  supportHeight?: number;
  supportPadding?: SupportPadding;
  supportBorderRadius?: number;
  handleSettings?: Handle;
}

export enum ModelType {
  TextOnly = 1,
  TextWithSupport = 2,
  NegativeText = 3,
  VerticalTextWithSupport = 4,
}

type SingleGlyphDef = {
  paths: THREE.Path[];
  holes: THREE.Path[];
};

type MultipleGlyphDef = {
  glyphs: SingleGlyphDef[];
  bounds: {
    min: { x: number; y: number };
    max: { x: number; y: number };
  };
};

export default class TextMakerService extends Service {
  private glyphToShapes(
    outlinesFormat: string,
    glyph: opentype.Glyph,
    size: number,
    xOffset: number,
    yOffset: number,
  ): SingleGlyphDef {
    // Font x/y origin to Three x/y origin
    const coord = function (x: number, y: number): [number, number] {
      return [x, 0 - y];
    };

    let paths: THREE.Path[] = [];
    const holes: THREE.Path[] = [];

    let path = new THREE.Path();

    const pathCommands = glyph.getPath(xOffset, 0 - yOffset, size).commands;

    // Following is only to manage "cff" font & detect hole shape
    const paths2D: Path2D[] = [];
    let path2D = new Path2D();

    // https://github.com/opentypejs/opentype.js#path-commands
    for (let i = 0; i < pathCommands.length; i++) {
      const command = pathCommands[i];

      switch (command.type) {
        case 'M':
          path = new THREE.Path();
          path2D = new Path2D();
          path.moveTo(...coord(command.x, command.y));
          path2D.moveTo(...coord(command.x, command.y));
          break;
        case 'Z':
          path.closePath();
          path2D.closePath();

          // With CCF font Detect path/hole can be done only at the end with all path...
          if (outlinesFormat === 'cff') {
            paths.push(path);
            paths2D.push(path2D);
          } else {
            if (THREE.ShapeUtils.isClockWise(path.getPoints())) {
              paths.push(path);
            } else {
              holes.push(path);
            }
          }

          break;
        case 'L':
          path.lineTo(...coord(command.x, command.y));
          path2D.lineTo(...coord(command.x, command.y));
          break;
        case 'C':
          path.bezierCurveTo(
            ...coord(command.x1, command.y1),
            ...coord(command.x2, command.y2),
            ...coord(command.x, command.y),
          );
          path2D.bezierCurveTo(
            ...coord(command.x1, command.y1),
            ...coord(command.x2, command.y2),
            ...coord(command.x, command.y),
          );
          break;
        case 'Q':
          path.quadraticCurveTo(...coord(command.x1, command.y1), ...coord(command.x, command.y));
          path2D.quadraticCurveTo(...coord(command.x1, command.y1), ...coord(command.x, command.y));
          break;
      }
    }

    // https://github.com/opentypejs/opentype.js/issues/347
    // if "cff" : subpath B contained by outermost subpath A is a cutout ...
    // if "truetype" : solid shapes are defined clockwise (CW) and holes are defined counterclockwise (CCW)
    if (outlinesFormat === 'cff') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      for (let i = 0; i < paths.length; i++) {
        path = paths[i];

        let isHole = false;
        for (const otherPath of paths2D.filter((_, idx) => idx !== i)) {
          // Iterate on path point & check if they are inside any existing paths
          isHole = path.getPoints().every(function (point) {
            return ctx?.isPointInPath(otherPath, point.x, point.y);
          });

          if (isHole) {
            break;
          }
        }

        if (isHole) {
          holes.push(path);
        }
      }

      paths = paths.filter((p) => holes.indexOf(p) === -1);
    }

    return {
      paths,
      holes,
    };
  }

  private glyphsDefToGeometry(depth: number, glyphsDef: MultipleGlyphDef): THREE.BufferGeometry {
    const geometries: THREE.ExtrudeGeometry[] = [];

    for (const glyphDef of glyphsDef.glyphs) {
      const shapes = glyphDef.paths.map(function (path) {
        const shape = new THREE.Shape();
        shape.add(path);
        shape.holes = glyphDef.holes;
        return shape;
      });

      const geometry = new THREE.ExtrudeGeometry(shapes, {
        depth,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0,
      });

      geometries.push(geometry);
    }

    return mergeBufferGeometries(geometries.flat());
  }

  private stringToGlyhpsDef(params: TextMakerParameters, font: opentype.Font): MultipleGlyphDef {
    const text = params.text || textMakerDefault.text;
    const size =
      params.size !== undefined && params.size >= 0 ? params.size : textMakerDefault.size;
    const spacing = params.spacing !== undefined ? params.spacing : textMakerDefault.spacing;
    const vSpacing = params.vSpacing !== undefined ? params.vSpacing : textMakerDefault.vSpacing;
    const alignment =
      params.alignment !== undefined ? params.alignment : textMakerDefault.alignment;
    const vAlignment =
      params.vAlignment !== undefined ? params.vAlignment : textMakerDefault.vAlignment;

    const scale = (1 / font.unitsPerEm) * size;

    const glyphShapes: SingleGlyphDef[] = [];
    // to handle alignment
    const linesWidth: number[] = [];
    const linesMaxY: { maxY: number; minY: number }[] = [];
    const linesGlyphInfos: Array<Array<{ height: number; maxY: number; minY: number }>> = [];
    const bounds = {
      min: { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER },
      max: { x: 0, y: 0 },
    };

    const lines = text.split('\n').map((s) => s.trimEnd());
    let dy = 0;

    // Iterate a first time on all lines to calculate line width (text align)
    for (const lineText of lines) {
      let dx = 0;
      let lineMaxX = 0;
      const lineMaxY = { minY: Number.MAX_SAFE_INTEGER, maxY: -Number.MAX_SAFE_INTEGER };
      const lineGlyphInfos: { height: number; maxY: number; minY: number }[] = [];

      font.forEachGlyph(lineText, 0, 0, size, undefined, (glyph, x, y) => {
        x += dx;
        dx += spacing;
        const glyphBounds = glyph.getBoundingBox();

        lineMaxX = x + glyphBounds.x2 * scale;
        const glyphHeight = (glyphBounds.y2 - glyphBounds.y1) * scale;

        const minY = Math.min(glyphBounds.y1, glyphBounds.y2) * scale;
        const maxY = Math.max(glyphBounds.y1, glyphBounds.y2) * scale;

        lineMaxY.maxY = Math.max(lineMaxY.maxY, maxY);
        lineMaxY.minY = Math.min(lineMaxY.minY, minY);

        lineGlyphInfos.push({
          height: glyphHeight,
          maxY,
          minY,
        });

        bounds.min.x = Math.min(bounds.min.x, x + glyphBounds.x1 * scale);
        bounds.min.y = Math.min(bounds.min.y, y - dy + glyphBounds.y1 * scale);
        bounds.max.x = Math.max(bounds.max.x, x + glyphBounds.x2 * scale);
        bounds.max.y = Math.max(bounds.max.y, y - dy + glyphBounds.y2 * scale);
      });

      dy += size + vSpacing;

      // Keep this for each line to handle alignment
      linesWidth.push(lineMaxX);
      linesMaxY.push(lineMaxY);
      linesGlyphInfos.push(lineGlyphInfos);
    }

    const linesAlignOffset = linesWidth.map(() => 0);

    // Handle horizontal alignment (now we know all line size)
    if (alignment !== 'left') {
      const maxWidth = Math.max(...linesWidth);

      linesWidth.forEach(function (lineWidth, line) {
        if (lineWidth !== maxWidth) {
          const xOffset = (maxWidth - lineWidth) / (alignment === 'center' ? 2 : 1);
          linesAlignOffset[line] = xOffset;
        }
      });
    }

    dy = 0;
    for (const lineIndex in lines) {
      const lineText = lines[lineIndex];
      let dx = 0;
      let glyphIndex = 0;

      // Iterate on text char to generate a Geometry for each
      font.forEachGlyph(lineText, 0, 0, size, undefined, (glyph, x, y) => {
        x += dx + linesAlignOffset[lineIndex];

        if (vAlignment !== 'default') {
          const lineMaxY = linesMaxY[lineIndex];
          const glyphInfo = linesGlyphInfos[lineIndex][glyphIndex];

          if (vAlignment === 'bottom' && lineMaxY.minY !== glyphInfo.minY) {
            y += lineMaxY.minY - glyphInfo.minY;
          } else if (vAlignment === 'top' && lineMaxY.maxY !== glyphInfo.maxY) {
            y += lineMaxY.maxY - glyphInfo.maxY;
          }
        }

        glyphShapes.push(
          this.glyphToShapes(
            font.outlinesFormat,
            glyph,
            size,
            x, // x offset
            y - dy, // y offset
          ),
        );
        dx += spacing;
        glyphIndex++;
      });

      dy += size + vSpacing;
    }

    return {
      glyphs: glyphShapes,
      bounds,
    };
  }

  private generateSupportShape(
    width: number,
    height: number,
    radius: number,
    handleSettings: Handle | undefined,
  ): THREE.Shape {
    return generateSupportShape(width, height, radius, handleSettings);
  }

  private translatePath(path: THREE.Path, x: number, y: number) {
    return new THREE.Path(
      path.getPoints().map((p) => {
        return new THREE.Vector2(p.x + x, p.y + y);
      }),
    );
  }

  generateMesh(params: TextMakerParameters, font: opentype.Font): THREE.Mesh {
    const type = params.type || ModelType.TextOnly;

    const textDepth =
      params.height !== undefined && params.height >= 0 ? params.height : textMakerDefault.height;

    const vAlignment =
      params.vAlignment !== undefined ? params.vAlignment : textMakerDefault.vAlignment;

    const plyghsDef = this.stringToGlyhpsDef(params, font);
    let supportShape: THREE.Shape | undefined = undefined;

    let finalGeometry: THREE.BufferGeometry;

    const { min, max } = plyghsDef.bounds;
    const size = {
      x: max.x - min.x,
      y: max.y - min.y,
      z: textDepth,
    };

    // Support settings
    let supportDepth = params.supportHeight || textMakerDefault.supportHeight;
    const supportPadding =
      params.supportPadding !== undefined ? params.supportPadding : textMakerDefault.supportPadding;
    const supportWidth = size.x + supportPadding.left + supportPadding.right;
    const supportHeight = size.y + supportPadding.top + supportPadding.bottom;
    const supportBorderRadius =
      params.supportBorderRadius !== undefined
        ? params.supportBorderRadius
        : textMakerDefault.supportBorderRadius;

    if (type !== ModelType.TextOnly) {
      // Generate support
      supportShape = this.generateSupportShape(
        supportWidth,
        supportHeight,
        supportBorderRadius,
        params.handleSettings,
      );
    }

    if (type === ModelType.NegativeText) {
      // Ensure support height is equal or greater than text height
      if (supportDepth < size.z) {
        supportDepth += size.z - supportDepth;
      }

      const moveTextX = -min.x + supportPadding.left;
      const moveTextY = -min.y + supportPadding.bottom;

      let supportGeometry: THREE.ExtrudeBufferGeometry | undefined;

      if (supportDepth > textDepth) {
        const plainSupportDepth = supportDepth - textDepth;

        supportGeometry = new THREE.ExtrudeGeometry(supportShape, {
          depth: plainSupportDepth,
          bevelEnabled: true,
          bevelThickness: 0,
          bevelSize: 0,
          bevelOffset: 0,
          bevelSegments: 0,
        });
      }

      // extract glyph path & move them according to support padding
      const glyphsPaths = plyghsDef.glyphs
        .map((g) => g.paths)
        .flat()
        .map((p) => this.translatePath(p, moveTextX, moveTextY));
      const glyphsHolesPaths = plyghsDef.glyphs
        .map((g) => g.holes)
        .flat()
        .map((p) => this.translatePath(p, moveTextX, moveTextY));

      // Add Glyph paths as hole in support & extrude
      supportShape?.holes.push(...glyphsPaths);
      const negativeTextGeometry = new THREE.ExtrudeGeometry(supportShape, {
        depth: textDepth,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0,
      });

      // Extrude glyph holes as geometry
      const glyphsHolesShapes = glyphsHolesPaths.map(function (path) {
        const s = new THREE.Shape();
        s.add(path);
        return s;
      });
      const negativeTextHoleGeometry = new THREE.ExtrudeGeometry(glyphsHolesShapes, {
        depth: textDepth,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0,
      });

      if (supportDepth > textDepth) {
        // Move negative text
        negativeTextGeometry.applyMatrix4(
          new THREE.Matrix4().makeTranslation(0, 0, supportDepth - textDepth),
        );
        negativeTextHoleGeometry.applyMatrix4(
          new THREE.Matrix4().makeTranslation(0, 0, supportDepth - textDepth),
        );
      }

      const geometries = [negativeTextGeometry, negativeTextHoleGeometry];
      if (supportGeometry) {
        geometries.push(supportGeometry);
      }

      finalGeometry = mergeBufferGeometries(geometries);
    } else {
      const textGeometry = this.glyphsDefToGeometry(textDepth, plyghsDef);

      if (type !== ModelType.TextOnly) {
        const supportGeometry = new THREE.ExtrudeGeometry(supportShape, {
          depth: supportDepth,
          bevelEnabled: true,
          bevelThickness: 0,
          bevelSize: 0,
          bevelOffset: 0,
          bevelSegments: 0,
        });

        if (type === ModelType.TextWithSupport) {
          // Move text in support according to padding settings
          textGeometry.applyMatrix4(
            new THREE.Matrix4().makeTranslation(
              -min.x + supportPadding.left,
              -min.y + supportPadding.bottom,
              supportDepth,
            ),
          );
        } else if (type === ModelType.VerticalTextWithSupport) {
          // Ensure bottom of the text is touching the support
          const verticalOffset = vAlignment === 'bottom' ? Math.min(0, plyghsDef.bounds.min.y) : 0;

          // Rotate & move text
          textGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
          textGeometry.applyMatrix4(
            new THREE.Matrix4().makeTranslation(
              supportPadding.left,
              supportPadding.bottom + size.z * 2,

              supportDepth - verticalOffset,
            ),
          );
        }

        finalGeometry = mergeBufferGeometries([supportGeometry, textGeometry]);
      } else {
        finalGeometry = textGeometry;
      }
    }

    return new THREE.Mesh(
      finalGeometry,
      new THREE.MeshLambertMaterial({
        ...meshParameters,
        side: THREE.DoubleSide,
      }),
    );
  }
}

declare module '@ember/service' {
  interface Registry {
    'text-maker': TextMakerService;
  }
}
