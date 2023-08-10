import Component from '@glimmer/component';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setComponentTemplate } from '@ember/component';
import config from 'text2stl/config/environment';
const {
  APP: { availableLanguages },
} = config;

import type IntlService from 'ember-intl/services/intl';

module('Integration | Component | lang-switcher', function (hooks) {
  setupRenderingTest(hooks);

  hooks.afterEach(function () {
    (this.owner.lookup('service:intl') as IntlService).locale = 'en-us';
  });

  test('it renders', async function (assert) {
    this.owner.register(
      'service:router',
      class extends Service {
        currentRouteName = 'the.current.route';
      },
    );

    class MyLinkTo extends Component {}
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(`<a ...attributes href="#" data-route={{@route}} data-model={{@model}}>{{yield}}</a>`),
      MyLinkTo,
    );

    this.owner.register('component:link-to', MyLinkTo);

    await render(hbs`<LangSwitcher class="my-custom-class" />`);

    assert
      .dom('[data-test-language-switcher]')
      .hasClass('uk-subnav', 'it renders a sub nav')
      .hasClass('my-custom-class', 'it applies custom attribute');

    assert
      .dom('[data-test-language-switcher] a')
      .exists({ count: availableLanguages.length }, 'available languages are render as link');

    assert
      .dom('[data-test-language-item="en-us"] a')
      .hasAttribute('data-route', 'the.current.route', 'LinkTo is linked to current route')
      .hasAttribute('data-model', 'en-us', 'LinkTo have language as lang model');

    assert
      .dom('[data-test-language-switcher] li.uk-active')
      .hasText('English', 'Current locale is "selected“');
    assert
      .dom('[data-test-language-item="fr-fr"]')
      .doesNotHaveClass('uk-active', 'Other button is not  "selected“');

    (this.owner.lookup('service:intl') as IntlService).locale = ['fr-fr'];
    await settled();

    assert
      .dom('[data-test-language-item="fr-fr"]')
      .hasClass('uk-active', 'Current locale is "selected“');
    assert
      .dom('[data-test-language-item="en-us"]')
      .doesNotHaveClass('uk-active', 'Other button is not  "selected“');

    (this.owner.lookup('service:intl') as IntlService).locale = ['en-us'];
    await settled();

    assert
      .dom('[data-test-language-item="en-us"]')
      .hasClass('uk-active', 'Current locale is "selected“');
    assert
      .dom('[data-test-language-item="fr-fr"]')
      .doesNotHaveClass('uk-active', 'Other button is not  "selected“');
  });
});
