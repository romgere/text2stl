import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, fillIn } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import config from 'text2stl/config/environment'
const {
  APP: { textMakerDefault }
} = config
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import loadFont from 'text2stl/tests/helpers/load-font'
import { ModelType } from 'text2stl/services/text-maker'
import click from '@ember/test-helpers/dom/click'

module('Integration | Component | advanced-settings-form/settings', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {

    let model = new TextMakerSettings({
      ...textMakerDefault,
      font: await loadFont('open_sans'),
      type: ModelType.TextWithSupport
    })
    this.set('model', model)

    await render(hbs`<SettingsForm::AdvancedSettings @model={{this.model}} />`)

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

    assert
      .dom('[data-test-settings-supportBorderRadius]')
      .hasValue(`${model.supportBorderRadius}`, 'It renders correct supportBorderRadius value')
    await fillIn('[data-test-settings-supportBorderRadius]', '789')
    assert.equal(model.supportBorderRadius, 789, 'model.supportBorderRadius was updated')

    assert.dom('[data-test-handle-type-item]').exists('it render handle type radio group')

    assert.dom('[data-test-handle-settings]').doesNotExist('it does not render handle settings when handle-type is "none"')

    await click('[data-test-handle-type-item] [value="hole"]')
    assert.dom('[data-test-handle-settings]').exists('it shows handle settings when handle type is "hole"')
    assert.equal(model.handleSettings.type, 'hole', 'handle type was updated')
    assert.dom('[data-test-settings-handle-size2]').doesNotExist('it does not render handle size 2 when handle type is "hole"')

    await click('[data-test-handle-type-item] [value="handle"]')
    assert.dom('[data-test-handle-settings]').exists('it shows handle settings when handle type is "handle"')
    assert.equal(model.handleSettings.type, 'handle', 'handle type was updated')
    assert.dom('[data-test-settings-handle-size2]').exists('it renders handle size 2 when handle type is "handle"')

    assert
      .dom('[data-test-handle-position] :checked')
      .hasAttribute('value', model.handleSettings.position, 'It render correct handle position value')

    assert
      .dom('[data-test-settings-handle-size]')
      .hasValue(`${model.handleSettings.size}`, 'It render correct handle size value')
    await fillIn('[data-test-settings-handle-size]', '123')
    assert.strictEqual(model.handleSettings.size, 123, 'handle size was updated')

    assert
      .dom('[data-test-settings-handle-size2]')
      .hasValue(`${model.handleSettings.size2}`, 'It render correct handle size2 value')
    await fillIn('[data-test-settings-handle-size2]', '321')
    assert.strictEqual(model.handleSettings.size2, 321, 'handle size2 was updated')

    assert
      .dom('[data-test-settings-handle-offsetX]')
      .hasValue(`${model.handleSettings.offsetX}`, 'It render correct handle offsetX value')
    await fillIn('[data-test-settings-handle-offsetX]', '456')
    assert.strictEqual(model.handleSettings.offsetX, 456, 'handle offsetX was updated')

    assert
      .dom('[data-test-settings-handle-offsetY]')
      .hasValue(`${model.handleSettings.offsetY}`, 'It render correct handle offsetY value')
    await fillIn('[data-test-settings-handle-offsetY]', '654')
    assert.strictEqual(model.handleSettings.offsetY, 654, 'handle offsetY was updated')

    await click('[data-test-handle-position] [value="bottom"]')
    assert.strictEqual(model.handleSettings.position, 'bottom', 'handle position was updated')
    assert.strictEqual(
      model.handleSettings.offsetX,
      textMakerDefault.handleSettings.offsetX,
      'handle offsetX was reset to a default value'
    )
    assert.strictEqual(
      model.handleSettings.offsetY,
      textMakerDefault.handleSettings.offsetY,
      'handle offsetY was reset to a default value'
    )

    await click('[data-test-handle-type-item] [value="hole"]')
    assert.strictEqual(model.handleSettings.position, 'top', 'handle position was reset to a default value')
    assert.strictEqual(
      model.handleSettings.offsetX,
      textMakerDefault.handleSettings.offsetX,
      'handle offsetX was reset to a default value'
    )
    assert.strictEqual(
      model.handleSettings.offsetY,
      textMakerDefault.handleSettings.offsetY,
      'handle offsetY was reset to a default value'
    )

    await click('[data-test-handle-position] [value="left"]')
    assert.strictEqual(model.handleSettings.position, 'left', 'handle position was updated')
    assert.strictEqual(
      model.handleSettings.offsetX,
      textMakerDefault.handleSettings.offsetX,
      'handle offsetX was reset to a default value'
    )
    assert.strictEqual(
      model.handleSettings.offsetY,
      textMakerDefault.handleSettings.offsetY,
      'handle offsetY was reset to a default value'
    )
  })
})
