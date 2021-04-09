import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, settled } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
// eslint-disable-next-line ember/no-classic-components
import Component from '@ember/component'
import Service from '@ember/service'

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
    this.owner.register('service:router', class extends Service {
      currentRouteName = 'the.current.route'
    })

    this.owner.register(
      'component:link-to',
      class extends Component {
        layout = hbs`<a ...attributes href="#" data-route={{@route}} data-model={{@model}}>{{yield}}</a>`
      }
    )

    await render(hbs`<LangSwitcher class="my-custom-class" />`)

    assert
      .dom('[data-test-language-switcher]')
      .hasClass('uk-subnav', 'it renders a sub nav')
      .hasClass('my-custom-class', 'it applies custom attribute')

    assert.dom('[data-test-language-switcher] a').exists(
      { count: availableLanguages.length },
      'available languages are render as link'
    )

    assert
      .dom('[data-test-language-item="en-us"] a')
      .hasAttribute('data-route', 'the.current.route', 'LinkTo is linked to current route')
      .hasAttribute('data-model', 'en-us', 'LinkTo have language as lang model')

    assert
      .dom('[data-test-language-switcher] li.uk-active')
      .hasText('English', 'Current locale is "selected“')
    assert
      .dom('[data-test-language-item="fr-fr"]')
      .doesNotHaveClass('uk-active', 'Other button is not  "selected“')

    this.owner.lookup('service:intl').locale = ['fr-fr']
    await settled()

    assert
      .dom('[data-test-language-item="fr-fr"]')
      .hasClass('uk-active', 'Current locale is "selected“')
    assert
      .dom('[data-test-language-item="en-us"]')
      .doesNotHaveClass('uk-active', 'Other button is not  "selected“')

    this.owner.lookup('service:intl').locale = ['en-us']
    await settled()

    assert
      .dom('[data-test-language-item="en-us"]')
      .hasClass('uk-active', 'Current locale is "selected“')
    assert
      .dom('[data-test-language-item="fr-fr"]')
      .doesNotHaveClass('uk-active', 'Other button is not  "selected“')
  })
})
