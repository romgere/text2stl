import Route from '@ember/routing/route'
import { hash } from 'rsvp'
import { inject as service } from '@ember/service'
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import FontManagerService from 'text2stl/services/font-manager'
import config from 'text2stl/config/environment'
const {
  APP: { textMakerDefault }
} = config

export default class AppGenerateRoute extends Route {

  @service declare fontManager: FontManagerService

  async model() {

    // Fetch default font
    let defaultFont = await this.fontManager.fetchFont(
      textMakerDefault.fontName,
      textMakerDefault.variantName,
      textMakerDefault.fontSize
    )

    return hash({
      fonts: this.fontManager.fonts,
      fontNames: this.fontManager.fontNames,
      // Create a default settings for first rendering
      settings: new TextMakerSettings({
        ...textMakerDefault,
        font: defaultFont
      })
    })
  }
}
