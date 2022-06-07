import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import FontManagerService from 'text2stl/services/font-manager'
import config from 'text2stl/config/environment'

import type GeneratorController from 'text2stl/controllers/app/generator'
import Transition from '@ember/routing/-private/transition'

const {
  APP: { textMakerDefault }
} = config

export default class ApplicationRoute extends Route {

  @service declare fontManager: FontManagerService

  async model() {

    // Fetch default font
    let defaultFont = await this.fontManager.fetchFont(
      textMakerDefault.fontName,
      textMakerDefault.variantName,
      textMakerDefault.fontSize
    )

    // Create a default settings for first rendering
    return new TextMakerSettings({
      ...textMakerDefault,
      supportPadding: { ...textMakerDefault.supportPadding },
      handleSettings: { ...textMakerDefault.handleSettings },
      font: defaultFont
    })
  }

  afterModel() {
    document.querySelector('#app-loader')?.remove()
  }

  setupController(controller: GeneratorController, model: TextMakerSettings, transition: Transition) {
    super.setupController(controller, model, transition)
    // Trigger initial font loading
    controller.onFontChange()
  }
}
