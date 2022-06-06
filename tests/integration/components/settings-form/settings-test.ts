import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, fillIn, click } from '@ember/test-helpers'
import cases from 'qunit-parameterize'
import hbs from 'htmlbars-inline-precompile'
import config from 'text2stl/config/environment'
const {
  APP: { textMakerDefault }
} = config
import TextMakerSettings from 'text2stl/models/text-maker-settings'
import loadFont from 'text2stl/tests/helpers/load-font'
import { ModelType } from 'text2stl/services/text-maker'

module('Integration | Component | settings-form/settings', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {

    let model = new TextMakerSettings({
      ...textMakerDefault,
      font: await loadFont('open_sans'),
      type: ModelType.TextOnly
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

    await click(`[data-test-settings-type] [data-test-type-item="${ModelType.NegativeText}"]`)
    assert.equal(model.type, ModelType.NegativeText, 'model.type was updated')

    assert
      .dom('[data-test-settings-supportHeight]')
      .hasValue(`${model.supportHeight}`, 'It renders correct supportHeight value')
    await fillIn('[data-test-settings-supportHeight]', '456')
    assert.equal(model.supportHeight, 456, 'model.supportHeight was updated')

    assert
      .dom('[data-test-settings-supportPadding]')
      .hasValue(`${model.supportPadding.top}`, 'It renders correct supportPadding value')
    await fillIn('[data-test-settings-supportPadding]', '789')
    assert.strictEqual(model.supportPadding.top, 789, 'model.supportPadding.top was updated')
    assert.strictEqual(model.supportPadding.bottom, 789, 'model.supportPadding.bottom was updated')
    assert.strictEqual(model.supportPadding.left, 789, 'model.supportPadding.left was updated')
    assert.strictEqual(model.supportPadding.right, 789, 'model.supportPadding.right was updated')
  })

  cases([
    { type: ModelType.TextOnly, inputType: 'textarea', title: 'TextOnly' },
    { type: ModelType.NegativeText, inputType: 'textarea', title: 'NegativeText' },
    { type: ModelType.TextWithSupport, inputType: 'textarea', title: 'TextWithSupport' },
    { type: ModelType.VerticalTextWithSupport, inputType: 'input', title: 'VerticalTextWithSupport' }
  ]).test('Text input type depends on model Type', async function({ type, inputType }, assert) {

    let model = new TextMakerSettings({
      ...textMakerDefault,
      font: await loadFont('open_sans'),
      type
    })
    this.set('model', model)

    await render(hbs`<SettingsForm::Settings @model={{this.model}} />`)
    assert.dom(`${inputType}[data-test-settings-text]`).exists(`It renders a ${inputType}`)
  })

  test('Text alignment & vertical spacing are shown when text is multiline', async function(assert) {

    let model = new TextMakerSettings({
      ...textMakerDefault,
      font: await loadFont('open_sans'),
      type: ModelType.TextOnly
    })
    this.set('model', model)

    await render(hbs`<SettingsForm::Settings @model={{this.model}} />`)
    assert.dom('[data-test-settings-text-alignment]').doesNotExist()
    assert.dom('[data-test-settings-vspacing]').doesNotExist()

    await fillIn('[data-test-settings-text]', 'some\nmultiline\ntext')

    assert.dom('[data-test-settings-text-alignment]').exists()
    assert
      .dom(`[data-test-settings-text-alignment] input[type="radio"][value="${model.alignment}"]`)
      .hasValue('center', 'current textAlignment radio is checked')
    await click('[data-test-settings-text-alignment] input[type="radio"][value="right"]')
    assert.equal(model.alignment, 'right', 'model.alignment was updated')

    assert
      .dom('[data-test-settings-vspacing]')
      .hasValue(`${model.vSpacing}`, 'It renders correct vspacing value')
    await fillIn('[data-test-settings-vspacing]', '237')
    assert.equal(model.vSpacing, 237, 'model.vspacing was updated')
  })

  test('multi-line text is flatten when switch model type to vertical', async function(assert) {

    let model = new TextMakerSettings({
      ...textMakerDefault,
      font: await loadFont('open_sans'),
      type: ModelType.TextOnly,
      text: 'some\nmultiline\ntext'
    })
    this.set('model', model)

    await render(hbs`<SettingsForm::Settings @model={{this.model}} />`)
    await click(`[data-test-settings-type] [data-test-type-item="${ModelType.VerticalTextWithSupport}"]`)
    assert.equal(model.text, 'some multiline text', 'text was updated')
  })
})
