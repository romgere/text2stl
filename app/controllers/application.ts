import Controller from '@ember/controller'
import { action } from '@ember/object'
import { inject as service } from '@ember/service'
import FontManagerService from 'text2stl/services/font-manager'
import TextMakerService from 'text2stl/services/text-maker'

import type { FontName } from 'text2stl/services/font-manager'
import type { Mesh } from 'three'
import type { ApplicationRouteModel } from 'text2stl/routes/application'

export default class ApplicationController extends Controller {

  @service declare textMaker: TextMakerService

  @service declare fontManager: FontManagerService

  declare model: ApplicationRouteModel

  get mesh(): Mesh {
    return this.textMaker.generateMesh(this.model.settings)
  }

  get exportDisabled() {
    return !this.mesh
  }

  get currentFont() {
    return this.fontManager.fetchFont(this.model.settings.fontName)
  }

  @action
  async updateFont(fontName: FontName) {
    this.model.settings.fontName = fontName
    this.model.settings.font = await this.currentFont
  }

  @action
  setInt(props: 'size' | 'height' | 'spacing', value: string) {
    let v = parseInt(value, 10)
    this.model.settings[props] = isNaN(v) ? undefined : v
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
    'application': ApplicationController;
  }
}
