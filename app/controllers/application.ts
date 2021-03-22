import Controller from '@ember/controller'
import { tracked } from '@glimmer/tracking'
import { action } from '@ember/object'
import { inject as service } from '@ember/service'
import FontManager from 'text2stl/services/font-manager'
import TextMaker from 'text2stl/services/text-maker'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'

import type { FontName } from 'text2stl/services/font-manager'
import type { BufferGeometry, Mesh } from 'three'

export default class Application extends Controller {

  @service declare textMaker: TextMaker

  @service declare fontManager: FontManager

  @tracked mesh?: Mesh

  @tracked font: string = 'Parisienne'

  @tracked text: string = 'Romgere'

  @tracked size: number = 72

  @tracked height: number = 20

  @tracked spacing: number = 10

  get geometry(): BufferGeometry {
    return this.textMaker.stringToGeometry(this.model.settings)
  }

  get exportDisabled() {
    return !this.mesh
  }

  @action
  async updateFont(fontName: FontName) {
    this.model.settings.fontName = fontName
    this.model.settings.font = await this.fontManager.fetchFont(fontName)
  }

  @action
  setInt(props: 'size' | 'height' | 'spacing', value: string) {
    let v = parseInt(value, 10)
    this.model.settings[props] = isNaN(v) ? undefined : v
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
