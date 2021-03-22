import Controller from '@ember/controller'
import { tracked } from '@glimmer/tracking'
import { action } from '@ember/object'
import * as opentype from 'opentype.js'
import { inject as service } from '@ember/service'
import TextMaker from 'text2stl/services/text-maker'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import type { BufferGeometry, Mesh } from 'three'

export default class Application extends Controller {

  @service declare textMaker: TextMaker

  @tracked mesh?: Mesh

  @tracked font: string = 'Parisienne'

  @tracked text: string = 'Romgere'

  @tracked size: number = 72

  @tracked width: number = 20

  @tracked kerning: number = 10

  fontCache: Record<string, opentype.Font> = {}

  async getGoogleFont(fontName: string): Promise<opentype.Font> {

    let { variants } = this.model.fonts[fontName]
    let variant = variants['normal'] || variants[Object.keys(variants)[0]]
    let face = variant['400'] || variant[Object.keys(variant)[0]]

    let url = face.url.ttf!.replace('http:', ':')

    // TODO: add cache ?
    if (!this.fontCache[fontName]) {
      let res = await fetch(url)
      let fontData = await res.arrayBuffer()
      this.fontCache[fontName] = opentype.parse(fontData)
    }

    return this.fontCache[fontName]
  }

  get geometry(): Promise<BufferGeometry> {
    let params = {
      text: this.text || 'Hello',
      size: this.size,
      width: this.width,
      kerning: this.kerning
    }

    return this.getGoogleFont(this.font).then((font) => {
      return this.textMaker.stringToGeometry({
        ...params,
        font
      })
    })
  }

  get exportDisabled() {
    return !this.mesh
  }

  @action
  setInt(props: 'size' | 'width' | 'kerning', value: string) {
    this[props] = parseInt(value, 10)
  }

  @action
  registerMesh(mesh: Mesh) {
    this.mesh = mesh
  }

  @action
  exportSTL() {

    if (!this.mesh) {
      return
    }

    let result = (new STLExporter()).parse(this.mesh, { binary: true })
    let blob = new Blob([result], { type: 'application/octet-stream' })

    let link = document.createElement('a')
    link.style.display = 'none'
    document.body.appendChild(link)

    link.href = URL.createObjectURL(blob)
    link.download = 'output.stl'
    link.click()
  }
}

declare module '@ember/controller' {
  interface Registry {
    'application': Application;
  }
}
