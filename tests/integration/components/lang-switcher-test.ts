import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, click } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

import config from 'text2stl/config/environment'
const {
  APP: { availableLanguages }
} = config

module('Integration | Component | lang-switcher', function(hooks) {
  setupRenderingTest(hooks)

  hooks.afterEach(function() {
    this.owner.lookup('service:intl').locale = 'en-us'
  })

  test('it renders', async function(assert) {

    let intl = this.owner.lookup('service:intl')

    await render(hbs`<LangSwitcher class="my-custom-class" />`)

    assert
      .dom('[data-test-language-switcher]')
      .hasClass('uk-button-group', 'it renders a button group')
      .hasClass('my-custom-class', 'it applies custom attribute')

    assert.dom('[data-test-language-switcher] button').exists(
      { count: availableLanguages.length },
      'available languages are render as button'
    )

    assert
      .dom('[data-test-language-switcher] button.uk-button-secondary')
      .hasText('English', 'Current locale is "selected“')
    assert
      .dom('[data-test-language-button="fr-fr"]')
      .doesNotHaveClass('uk-button-secondary', 'Other button is not  "selected“')

    await click('[data-test-language-button="fr-fr"]')

    assert.deepEqual(
      intl.locale,
      ['fr-fr', 'en-us'],
      '"fr-fr" locale is set with "en-us" fallback'
    )

    assert
      .dom('[data-test-language-button="fr-fr"]')
      .hasClass('uk-button-secondary', 'Current locale is "selected“')
    assert
      .dom('[data-test-language-button="en-us"]')
      .doesNotHaveClass('uk-button-secondary', 'Other button is not  "selected“')

    await click('[data-test-language-button="en-us"]')

    assert.deepEqual(
      intl.locale,
      ['en-us'],
      '"en-us" locale is set'
    )

    assert
      .dom('[data-test-language-button="en-us"]')
      .hasClass('uk-button-secondary', 'Current locale is "selected“')
    assert
      .dom('[data-test-language-button="fr-fr"]')
      .doesNotHaveClass('uk-button-secondary', 'Other button is not  "selected“')
  })
})
