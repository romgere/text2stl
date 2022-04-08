import Controller from '@ember/controller'
import { action } from '@ember/object'
import { inject as service } from '@ember/service'
import FontManagerService from 'text2stl/services/font-manager'
import TextMakerService from 'text2stl/services/text-maker'
import STLExporterService from 'text2stl/services/stl-exporter'
import CounterService from 'text2stl/services/counter'
import type { Mesh } from 'three'
import type ApplicationRoute from 'text2stl/routes/app/generator'
import type IntlService from 'ember-intl/services/intl'
import { cached } from 'tracked-toolbox'
import { tracked } from '@glimmer/tracking'

export default class ApplicationController extends Controller {

  @service declare textMaker: TextMakerService

  @service declare fontManager: FontManagerService

  @service declare stlExporter: STLExporterService

  @service declare intl: IntlService

  @service('counter') declare counterService: CounterService

  declare model: RouteModel<ApplicationRoute>

  _gtag = gtag

  get counter() {
    return this.counterService.counter
  }

  @cached
  get mesh(): Mesh {
    this._gtag('event', 'stl_generation', {
      event_category: 'stl', // eslint-disable-line camelcase
      value: this.model.type
    })
    return this.textMaker.generateMesh(this.model)
  }

  get exportDisabled() {
    return !this.mesh
  }

  @tracked isFontLoading = true

  @action
  async onFontChange() {

    this.isFontLoading = true
    try {
      let fontFetchPromise = this.model.customFont
        ? this.fontManager.loadCustomFont(this.model.customFont)
        : this.fontManager.fetchFont(
          this.model.fontName,
          this.model.variantName,
          this.model.fontSize
        )

      this.model.font = await fontFetchPromise

      fontFetchPromise.then(() => this.isFontLoading = false)
    } catch(e) {
      alert(this.intl.t('errors.font_load_generic'))
    }
  }

  @action
  exportSTL() {
    let { mesh } = this

    if (!mesh) {
      return
    }

    this._gtag('event', 'stl_download', {
      event_category: 'stl', // eslint-disable-line camelcase
      value: this.model.type
    })

    this.counterService.updateCounter()
    this.stlExporter.downloadMeshAsSTL(mesh)
  }
}

declare module '@ember/controller' {
  interface Registry {
    'app.generator': ApplicationController;
  }
}
