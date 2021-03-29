import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, fillIn, click } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import config from 'text2stl/config/environment'
const {
  APP: { textMakerDefault }
} = config
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import loadFont from 'text2stl/tests/helpers/load-font'

module('Integration | Component | settings-form/settings', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {

    let model = new TextMakerSettings({
      ...textMakerDefault,
      font: await loadFont('open_sans'),
      type: 1
    })
    this.set('model', model)

    await render(hbs`<SettingsForm::Settings @model={{this.model}} />`)

    assert.dom('[data-test-settings-type]').exists('It render type selector')

    assert
      .dom('[data-test-settings-text]')
      .hasValue(model.text, 'It renders correct text value')
    await fillIn('[data-test-settings-text]', 'Updated')
    assert.equal(model.text, 'Updated', 'model.text was updated')

    assert
      .dom('[data-test-settings-size]')
      .hasValue(`${model.size}`, 'It renders correct size value')
    await fillIn('[data-test-settings-size]', '123')
    assert.equal(model.size, 123, 'model.size was updated')

    assert
      .dom('[data-test-settings-height]')
      .hasValue(`${model.height}`, 'It renders correct height value')
    await fillIn('[data-test-settings-height]', '456')
    assert.equal(model.height, 456, 'model.height was updated')

    assert
      .dom('[data-test-settings-spacing]')
      .hasValue(`${model.spacing}`, 'It renders correct spacing value')
    await fillIn('[data-test-settings-spacing]', '789')
    assert.equal(model.spacing, 789, 'model.spacing was updated')

    assert
      .dom('[data-test-settings-supportHeight]')
      .doesNotExist('supportHeight field is not displayed when model.type is text only')
    assert
      .dom('[data-test-settings-supportPadding]')
      .doesNotExist('supportPadding field is not displayed when model.type is text only')

    await click('[data-test-settings-type] [data-test-type-item="3"]')
    assert.equal(model.type, 3, 'model.type was updated')

    assert
      .dom('[data-test-settings-supportHeight]')
      .hasValue(`${model.supportHeight}`, 'It renders correct supportHeight value')
    await fillIn('[data-test-settings-supportHeight]', '456')
    assert.equal(model.supportHeight, 456, 'model.supportHeight was updated')

    assert
      .dom('[data-test-settings-supportPadding]')
      .hasValue(`${model.supportPadding}`, 'It renders correct supportPadding value')
    await fillIn('[data-test-settings-supportPadding]', '789')
    assert.equal(model.supportPadding, 789, 'model.supportPadding was updated')
  })
})
