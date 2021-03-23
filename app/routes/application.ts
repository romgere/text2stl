import Route from '@ember/routing/route'
import { hash } from 'rsvp'
import { inject as service } from '@ember/service'
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import FontManager from 'text2stl/services/font-manager'
import config from 'text2stl/config/environment'
const {
  APP: { textMakerDefault }
} = config

type Resolved<P> = P extends Promise<infer T> ? T : P
export type ApplicationRouteModel = Resolved<ReturnType<ApplicationRoute['model']>>

export default class ApplicationRoute extends Route {

  @service declare fontManager: FontManager

  async model() {
    // Fetch default font
    let defaultFont = await this.fontManager.fetchFont(textMakerDefault.fontName)

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
