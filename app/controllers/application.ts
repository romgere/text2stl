import Controller from '@ember/controller'
import { action } from '@ember/object'
import { inject as service } from '@ember/service'
import FontManagerService from 'text2stl/services/font-manager'
import TextMakerService from 'text2stl/services/text-maker'
import STLExporterService from 'text2stl/services/stl-exporter'
import type { Mesh } from 'three'
import type ApplicationRoute from 'text2stl/routes/application'
import { htmlSafe } from '@ember/template'

export default class ApplicationController extends Controller {

  @service declare textMaker: TextMakerService

  @service declare fontManager: FontManagerService

  @service declare stlExporter: STLExporterService

  declare model: RouteModel<ApplicationRoute>

  get authorLink() {
    return htmlSafe('<a href="https://github.com/romgere" target="_blank" rel="noopener noreferrer">Romgere</a>')
  }

  get emberLink() {
    return htmlSafe('<a href="https://emberjs.com/" target="_blank" rel="noopener noreferrer">Ember.js</a>')
  }

  get threeLink() {
    return htmlSafe('<a href="https://threejs.org/"  target="_blank" rel="noopener noreferrer">three.js</a>')
  }

  get mesh(): Mesh {
    return this.textMaker.generateMesh(this.model.settings)
  }

  get exportDisabled() {
    return !this.mesh
  }

  get currentFont() {
    let { settings } = this.model
    return this.fontManager.fetchFont(
      settings.fontName,
      settings.variantName,
      settings.fontSize
    )
  }

  @action
  async onFontChange() {
    this.model.settings.font = await this.currentFont
  }

  @action
  exportSTL() {

    if (!this.mesh) {
      return
    }

    this.stlExporter.downloadMeshAsSTL(this.mesh)
  }
}

declare module '@ember/controller' {
  interface Registry {
    'application': ApplicationController;
  }
}
