import Route from '@ember/routing/route';
import TextMakerSettings from 'text2stl/models/text-maker-settings';
import config from 'text2stl/config/environment';

const {
  APP: { textMakerDefault },
} = config;

export default class ApplicationRoute extends Route {
  queryParams = {
    modelSettings: {
      replace: true, // No history for model changes
    },
  };

  async model(params: { modelSettings: string }) {
    // Create a default settings for first rendering
    const model = new TextMakerSettings({
      ...textMakerDefault,
      supportPadding: { ...textMakerDefault.supportPadding },
      handleSettings: { ...textMakerDefault.handleSettings },
    });

    // Load model settings from QP if any
    if (params.modelSettings) {
      model.deserialize(params.modelSettings);
    }

    return model;
  }

  afterModel() {
    document.querySelector('#app-loader')?.remove();
  }
}
