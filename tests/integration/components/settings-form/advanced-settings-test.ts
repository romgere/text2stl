import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, fillIn, settled } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import config from 'text2stl/config/environment'
const {
  APP: { textMakerDefault }
} = config
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import loadFont from 'text2stl/tests/helpers/load-font'
import { ModelType } from 'text2stl/services/text-maker'

module('Integration | Component | advanced-settings-form/settings', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {

    let model = new TextMakerSettings({
      ...textMakerDefault,
      font: await loadFont('open_sans'),
      type: ModelType.TextOnly
    })
    this.set('model', model)

    await render(hbs`<SettingsForm::AdvancedSettings @model={{this.model}} />`)

    assert.dom('[data-test-settings-support-padding]').doesNotExist('it does not render advanced support padding options when model is text-only')

    // Change type
    model.type = ModelType.TextWithSupport
    await settled()

    assert.dom('[data-test-settings-support-padding]').exists('it render advanced support padding options')

    assert
      .dom('[data-test-settings-supportPadding="top"]')
      .hasValue(`${model.supportPadding.top}`, 'It renders top supportPadding value')
    await fillIn('[data-test-settings-supportPadding="top"]', '123')
    assert.equal(model.supportPadding.top, 123, 'top supportPadding was updated')

    assert
      .dom('[data-test-settings-supportPadding="bottom"]')
      .hasValue(`${model.supportPadding.bottom}`, 'It renders correct bottom supportPadding value')
    await fillIn('[data-test-settings-supportPadding="bottom"]', '321')
    assert.equal(model.supportPadding.bottom, 321, 'bottom supportPadding was updated')

    assert
      .dom('[data-test-settings-supportPadding="left"]')
      .hasValue(`${model.supportPadding.left}`, 'It renders correct left supportPadding value')
    await fillIn('[data-test-settings-supportPadding="left"]', '456')
    assert.equal(model.supportPadding.left, 456, 'left supportPadding was updated')

    assert
      .dom('[data-test-settings-supportPadding="right"]')
      .hasValue(`${model.supportPadding.right}`, 'It renders correct right supportPadding value')
    await fillIn('[data-test-settings-supportPadding="right"]', '987')
    assert.equal(model.supportPadding.right, 987, 'right supportPadding was updated')
  })
})
