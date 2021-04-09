import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, click } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
// eslint-disable-next-line ember/no-classic-components
import Component from '@ember/component'

module('Integration | Component | settings-form', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {

    this.owner.register(
      'component:settings-form/settings',
      class extends Component {
        layout = hbs`<div data-mocked-settings data-model={{@model}} />`
      }
    )

    this.owner.register(
      'component:settings-form/font',
      class extends Component {
        layout = hbs`<div data-mocked-font data-model={{@model}} data-on-font-change={{@onFontChange}} />`
      }
    )

    await render(hbs`<SettingsForm @model="the_model" @onFontChange="on_font_change" />`)

    assert.dom('[uk-tab]').exists('It render tab')
    assert.dom('[uk-tab] li').exists({ count: 2 }, 'It render 2 tabs')

    assert.dom('[data-mocked-font]').isNotVisible('Font tab is not visible')
    assert
      .dom('[data-mocked-settings]')
      .exists('It render settings tab by default')
      .hasAttribute('data-model', 'the_model', 'Model is passed to settings component')

    // Change tab
    await click('[data-tab-item=font] a')

    assert.dom('[data-mocked-settings]').isNotVisible('Settings tab is not visible')
    assert
      .dom('[data-mocked-font]')
      .exists('font tab is rendered')
      .hasAttribute('data-model', 'the_model', 'Model is passed to font component')
      .hasAttribute('data-on-font-change', 'on_font_change', 'Model is passed to font component')
  })
})
