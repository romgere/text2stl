import Component from '@glimmer/component';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setComponentTemplate } from '@ember/component';
import { ModelType } from 'text2stl/services/text-maker';

module('Integration | Component | settings-form', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    class SettingsFormSettings extends Component {}
    setComponentTemplate(
      // @ts-expect-error
      hbs(`<div data-mocked-settings data-model={{@model.name}} />`),
      SettingsFormSettings,
    );
    this.owner.register('component:settings-form/settings', SettingsFormSettings);

    class SettingsFormFont extends Component {}
    setComponentTemplate(
      // @ts-expect-error
      hbs(`<div data-mocked-font data-model={{@model.name}} />`),
      SettingsFormFont,
    );
    this.owner.register('component:settings-form/font', SettingsFormFont);

    class SettingsFormAdvancedSettings extends Component {}
    setComponentTemplate(
      // @ts-expect-error
      hbs(`<div data-mocked-advanced-settings data-model={{@model.name}} />`),
      SettingsFormAdvancedSettings,
    );
    this.owner.register('component:settings-form/advanced-settings', SettingsFormAdvancedSettings);

    this.set('model', { type: ModelType.TextOnly, name: 'the_model' });
    await render(hbs`<SettingsForm @model={{this.model}} @onFontChange="on_font_change" />`);

    assert.dom('[uk-tab]').exists('It render tab');
    assert.dom('[uk-tab] li').exists({ count: 2 }, 'It render 2 tabs');
    assert.dom('[data-tab-item=advanced]').doesNotExist('advanced tab is not rendered');

    assert.dom('[data-mocked-font]').isNotVisible('Font tab is not visible');
    assert
      .dom('[data-mocked-advanced-settings]')
      .isNotVisible('Advanced settings tab is not visible');

    assert
      .dom('[data-mocked-settings]')
      .exists('It render settings tab by default')
      .hasAttribute('data-model', 'the_model', 'Model is passed to settings component');

    // Change tab
    await click('[data-tab-item=font] a');

    assert.dom('[data-mocked-settings]').isNotVisible('Settings tab is not visible');
    assert
      .dom('[data-mocked-advanced-settings]')
      .isNotVisible('Advanced settings tab is not visible');
    assert
      .dom('[data-mocked-font]')
      .exists('font tab is rendered')
      .hasAttribute('data-model', 'the_model', 'Model is passed to font component');

    this.set('model', { type: ModelType.TextWithSupport, name: 'the_model' });
    assert.dom('[uk-tab]').exists('It render tab');
    assert.dom('[uk-tab] li').exists({ count: 3 }, 'It render 3 tabs');
    assert.dom('[data-tab-item=advanced]').exists('advanced tab not rendered');

    // Change tab
    await click('[data-tab-item=advanced] a');

    assert.dom('[data-mocked-settings]').isNotVisible('Settings tab is not visible');
    assert.dom('[data-mocked-font]').isNotVisible('Font tab is not visible');
    assert
      .dom('[data-mocked-advanced-settings]')
      .exists('advanced-settings tab is rendered')
      .hasAttribute('data-model', 'the_model', 'Model is passed to font component');
  });
});
