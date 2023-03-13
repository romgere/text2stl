import Route from '@ember/routing/route'
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import config from 'text2stl/config/environment'

const {
  APP: { textMakerDefault }
} = config

export default class ApplicationRoute extends Route {

  async model() {

    // Create a default settings for first rendering
    return new TextMakerSettings({
      ...textMakerDefault,
      supportPadding: { ...textMakerDefault.supportPadding },
      handleSettings: { ...textMakerDefault.handleSettings }
    })
  }

  afterModel() {
    document.querySelector('#app-loader')?.remove()
  }
}
