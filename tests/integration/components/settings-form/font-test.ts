import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, click, triggerEvent, settled } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
// eslint-disable-next-line ember/no-classic-components
import Component from '@ember/component'
import { tracked } from '@glimmer/tracking'

module('Integration | Component | settings-form/font', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {

    // mock the FontPicker child component
    this.owner.register(
      'component:ui/font-picker/categories',
      class extends Component {
        layout = hbs`<div data-mocked-categories />`
      }
    )
    this.owner.register(
      'component:ui/font-picker/font-name-select',
      class extends Component {
        layout = hbs`<div data-mocked-font-name-select {{on "click" (fn @onChange "new_fontName")}} />`
      }
    )
    this.owner.register(
      'component:ui/font-picker/variant-name-select',
      class extends Component {
        layout = hbs`<div data-mocked-variant-name-select {{on "click" (fn @onChange "new_variantName")}} />`
      }
    )
    this.owner.register(
      'component:ui/font-picker/font-size-select',
      class extends Component {
        layout = hbs`<div data-mocked-font-size-select {{on "click" (fn @onChange "new_fontSize")}} />`
      }
    )
    this.owner.register(
      'component:ui/font-picker',
      class extends Component {
        layout = hbs`<div
          data-mocked-font-picker
          data-test-fontName="{{@fontName}}"
          data-test-variantName={{@variantName}}
          data-test-fontSize={{@fontSize}}
        >
          {{yield (hash
            categories=(component 'ui/font-picker/categories')
            fontNameSelect=(component 'ui/font-picker/font-name-select' onChange=@onFontNameChange)
            variantNameSelect=(component 'ui/font-picker/variant-name-select' onChange=@onVariantNameChange)
            fontSizeSelect=(component 'ui/font-picker/font-size-select' onChange=@onFontSizeChange)
          )}}
        </div>`
      }
    )

    class Model {
      fontName = 'initial_fontName'
      variantName = 'initial_variantName'
      fontSize = 'initial_fontSize'
      @tracked customFont = undefined
    }
    let model = new Model()
    this.set('model', model)

    this.set('onFontChange', function() {
      assert.step('onFontChange')
    })

    await render(hbs`<SettingsForm::Font
      @model={{this.model}}
      @onFontChange={{this.onFontChange}}
    />`)

    assert.dom('[data-test-custom-checkbox]').isNotChecked('custom font ck is unchecked by default')
    assert.dom('[data-test-custom-font-upload]').doesNotExist('Custom font upload is not rendered')

    assert.dom('[data-mocked-categories]').exists('It renders "categories" component')
    assert.dom('[data-mocked-font-name-select]').exists('It renders "font-name-select" component')
    assert.dom('[data-mocked-variant-name-select]').exists('It renders "variant-name-select" component')
    assert.dom('[data-mocked-font-size-select]').exists('It renders "font-size-select" component')

    assert
      .dom('[data-mocked-font-picker]')
      .hasAttribute('data-test-fontName', 'initial_fontName', 'Inital values are passed to font-picker component')
      .hasAttribute('data-test-variantName', 'initial_variantName', 'Inital values are passed to font-picker component')
      .hasAttribute('data-test-fontSize', 'initial_fontSize', 'Inital values are passed to font-picker component')

    await click('[data-mocked-font-name-select]')
    assert.equal(
      model.fontName,
      'new_fontName',
      'It handles fontName update'
    )
    assert.verifySteps(['onFontChange'])

    await click('[data-mocked-variant-name-select]')
    assert.equal(
      model.variantName,
      'new_variantName',
      'It handles variantName update'
    )
    assert.verifySteps(['onFontChange'])

    await click('[data-mocked-font-size-select]')
    assert.equal(
      model.fontSize,
      'new_fontSize',
      'It handles fontNfontSizeame update'
    )
    assert.verifySteps(['onFontChange'])

    await click('[data-test-custom-checkbox]')
    assert.verifySteps([])

    assert.dom('[data-test-custom-font-upload]').exists('Custom font upload is now rendered')
    assert.dom('[data-mocked-categories]').doesNotExist('It no longer renders "categories" component')
    assert.dom('[data-mocked-font-name-select]').doesNotExist('It no longer renders "font-name-select" component')
    assert.dom('[data-mocked-variant-name-select]').doesNotExist('It no longer renders "variant-name-select" component')
    assert.dom('[data-mocked-font-size-select]').doesNotExist('It no longer renders "font-size-select" component')

    assert.dom('[data-test-custom-font-name]').hasValue('None', 'custom font name input is "None"')

    let fontFile = { type: 'font/otf', name: 'ainsi_font_font.otf' }

    await triggerEvent('[data-test-custom-font-upload]', 'drop', {
      dataTransfer: {
        types: ['Files'],
        files: [
          fontFile
        ]
      }
    })

    // eslint-disable-next-line ember/no-settled-after-test-helper
    await settled() // Needed to prevent an weird async release error

    assert.verifySteps(['onFontChange'])
    assert.strictEqual(model.customFont, fontFile, 'model.customFont was update with font file')
    assert
      .dom('[data-test-custom-font-name]')
      .hasValue('ainsi_font_font.otf', 'custom font name input render custom font file name')

    // Switch back to google font
    await click('[data-test-custom-checkbox]')
    assert.verifySteps(['onFontChange'])
    assert.dom('[data-test-custom-font-upload]').doesNotExist('Custom font upload is no longer displayed')
    assert.dom('[data-mocked-categories]').exists('It renders google font components')
    assert.strictEqual(model.customFont, undefined, 'model.customFont was "reset" to undefined')

    // Switch back to custom font
    await click('[data-test-custom-checkbox]')
    assert.verifySteps(['onFontChange'])
    assert.dom('[data-test-custom-font-upload]').exists('Custom font upload is now rendered')
    assert.dom('[data-mocked-categories]').doesNotExist('It no longer renders "categories" component')
    assert.strictEqual(model.customFont, fontFile, 'model.customFont was update with font file')
    assert
      .dom('[data-test-custom-font-name]')
      .hasValue('ainsi_font_font.otf', 'custom font name input render custom font file name')
  })
})
