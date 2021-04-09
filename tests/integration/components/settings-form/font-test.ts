import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, click } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
// eslint-disable-next-line ember/no-classic-components
import Component from '@ember/component'

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

    let model = {
      fontName: 'initial_fontName',
      variantName: 'initial_variantName',
      fontSize: 'initial_fontSize'
    }
    this.set('model', model)

    let onFontChangeDone = assert.async(3)
    this.set('onFontChange', onFontChangeDone)

    await render(hbs`<SettingsForm::Font
      @model={{this.model}}
      @onFontChange={{this.onFontChange}}
    />`)

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

    await click('[data-mocked-variant-name-select]')
    assert.equal(
      model.variantName,
      'new_variantName',
      'It handles variantName update'
    )

    await click('[data-mocked-font-size-select]')
    assert.equal(
      model.fontSize,
      'new_fontSize',
      'It handles fontNfontSizeame update'
    )
  })
})
