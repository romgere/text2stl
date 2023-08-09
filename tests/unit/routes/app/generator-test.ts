import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import config from 'text2stl/config/environment'

import type ApplicationRoute from 'text2stl/routes/index'
const {
  APP: { textMakerDefault }
} = config

module('Unit | Route | app/generator', function(hooks) {
  setupTest(hooks)

  test('it creates a model with default values & fetch default font', async function(assert) {

    let route = this.owner.lookup('route:app/generator') as ApplicationRoute

    let model = await route.model()

    assert.propEqual(
      model,
      new TextMakerSettings(textMakerDefault),
      'settings model is conform'
    )
  })
})
