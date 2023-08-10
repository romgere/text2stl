import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerEvent, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setComponentTemplate } from '@ember/component';
import { tracked } from '@glimmer/tracking';
import templateOnly from '@ember/component/template-only';

module('Integration | Component | settings-form/font', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // mock the FontPicker child component
    const FontPickerCategories = templateOnly();
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(`<div data-mocked-categories />`),
      FontPickerCategories,
    );
    this.owner.register('component:ui/font-picker/categories', FontPickerCategories);

    const FontPickerfontNameSelect = templateOnly();
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(`<div data-mocked-font-name-select {{on "click" (fn @onChange "new_fontName")}} />`),
      FontPickerfontNameSelect,
    );
    this.owner.register('component:ui/font-picker/font-name-select', FontPickerfontNameSelect);

    const FontPickerFontVariantSelect = templateOnly();
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(
        `<div data-mocked-variant-name-select {{on "click" (fn @onChange "new_variantName")}} />`,
      ),
      FontPickerFontVariantSelect,
    );
    this.owner.register(
      'component:ui/font-picker/variant-name-select',
      FontPickerFontVariantSelect,
    );

    const FontPicker = templateOnly();
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(`
        <div
          data-mocked-font-picker
          data-test-fontName="{{@fontName}}"
          data-test-variantName={{@variantName}}
        >
          {{yield (hash
            categories=(component 'ui/font-picker/categories')
            fontNameSelect=(component 'ui/font-picker/font-name-select' onChange=@onFontSettingsChange)
            variantNameSelect=(component 'ui/font-picker/variant-name-select' onChange=(fn @onFontSettingsChange @fontName))
          )}}
        </div>
      `),
      FontPicker,
    );
    this.owner.register('component:ui/font-picker', FontPicker);

    class Model {
      fontName = 'initial_fontName';
      variantName = 'initial_variantName';
      @tracked customFont = undefined;
    }
    const model = new Model();
    this.set('model', model);

    await render(hbs`<SettingsForm::Font
      @model={{this.model}}
    />`);

    assert
      .dom('[data-test-custom-checkbox]')
      .isNotChecked('custom font ck is unchecked by default');
    assert.dom('[data-test-custom-font-upload]').doesNotExist('Custom font upload is not rendered');

    assert.dom('[data-mocked-categories]').exists('It renders "categories" component');
    assert.dom('[data-mocked-font-name-select]').exists('It renders "font-name-select" component');
    assert
      .dom('[data-mocked-variant-name-select]')
      .exists('It renders "variant-name-select" component');

    assert
      .dom('[data-mocked-font-picker]')
      .hasAttribute(
        'data-test-fontName',
        'initial_fontName',
        'Inital values are passed to font-picker component',
      )
      .hasAttribute(
        'data-test-variantName',
        'initial_variantName',
        'Inital values are passed to font-picker component',
      );

    await click('[data-mocked-font-name-select]');
    assert.strictEqual(model.fontName, 'new_fontName', 'It handles fontName update');

    await click('[data-mocked-variant-name-select]');
    assert.strictEqual(model.variantName, 'new_variantName', 'It handles variantName update');

    await click('[data-test-custom-checkbox]');
    assert.verifySteps([]);

    assert.dom('[data-test-custom-font-upload]').exists('Custom font upload is now rendered');
    assert
      .dom('[data-mocked-categories]')
      .doesNotExist('It no longer renders "categories" component');
    assert
      .dom('[data-mocked-font-name-select]')
      .doesNotExist('It no longer renders "font-name-select" component');
    assert
      .dom('[data-mocked-variant-name-select]')
      .doesNotExist('It no longer renders "variant-name-select" component');

    assert.dom('[data-test-custom-font-name]').hasValue('None', 'custom font name input is "None"');

    const fontFile = { type: 'font/otf', name: 'ainsi_font_font.otf' };

    await triggerEvent('[data-test-custom-font-upload]', 'drop', {
      dataTransfer: {
        types: ['Files'],
        files: [fontFile],
      },
    });

    // eslint-disable-next-line ember/no-settled-after-test-helper
    await settled(); // Needed to prevent an weird async release error

    assert.strictEqual(model.customFont, fontFile, 'model.customFont was update with font file');
    assert
      .dom('[data-test-custom-font-name]')
      .hasValue('ainsi_font_font.otf', 'custom font name input render custom font file name');

    // Switch back to google font
    await click('[data-test-custom-checkbox]');
    assert
      .dom('[data-test-custom-font-upload]')
      .doesNotExist('Custom font upload is no longer displayed');
    assert.dom('[data-mocked-categories]').exists('It renders google font components');
    assert.strictEqual(model.customFont, undefined, 'model.customFont was "reset" to undefined');

    // Switch back to custom font
    await click('[data-test-custom-checkbox]');
    assert.dom('[data-test-custom-font-upload]').exists('Custom font upload is now rendered');
    assert
      .dom('[data-mocked-categories]')
      .doesNotExist('It no longer renders "categories" component');
    assert.strictEqual(model.customFont, fontFile, 'model.customFont was update with font file');
    assert
      .dom('[data-test-custom-font-name]')
      .hasValue('ainsi_font_font.otf', 'custom font name input render custom font file name');
  });
});
