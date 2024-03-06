import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import waitUntil from '@ember/test-helpers/wait-until';
import mockTextSettings from 'text2stl/tests/helpers/mock-text-maker-settings';
import { Font } from 'opentype.js';
import { Mesh } from 'three';
import type { TextMakerParameters } from 'text2stl/services/text-maker';
import type { Variant } from 'text2stl/services/font-manager';
import type GeneratorController from 'text2stl/controllers/app/generator';

function mockFont(name: string, variant: Variant) {
  return new Font({
    familyName: `mocked_${name}_${variant}`,
    styleName: 'mocked',
    unitsPerEm: 16,
    ascender: 1,
    descender: -1,
    glyphs: [],
  });
}

module('Unit | Controller | app/generator', function (hooks) {
  setupTest(hooks);

  test('it handles font change & font loading (google font)', async function (assert) {
    assert.expect(3);

    const controller = this.owner.lookup('controller:app/generator') as GeneratorController;

    this.owner.lookup('service:font-manager').fetchFont = async function (
      name: string,
      variant: Variant,
    ) {
      assert.strictEqual(name, controller.model.fontName, 'it requires correct fontName');
      assert.strictEqual(variant, controller.model.variantName, 'it requires correct variantName');
      return mockFont(name, variant);
    };

    controller.model = mockTextSettings({
      fontName: 'my-font',
      variantName: '500italic',
    });

    // Wait for the font to be load
    await waitUntil(() => controller.font.isResolved);
    assert.strictEqual(
      controller.font.value?.names.fontFamily['en'],
      'mocked_my-font_500italic',
      'Font was load on model',
    );
  });

  test('it handles font change & font loading (custom font)', async function (assert) {
    assert.expect(2);
    this.owner.lookup('service:font-manager').loadCustomFont = async function (file: Blob) {
      const filename = await new Response(file).text();
      assert.strictEqual(filename, 'my-font.file', 'font file is passed to font-manager');
      return mockFont(filename, '100');
    };

    const controller = this.owner.lookup('controller:app/generator') as GeneratorController;

    const model = mockTextSettings({});
    model.customFont = new Blob(['my-font.file'], {
      type: 'text/plain',
    });
    controller.model = model;

    // Wait for the font to be load
    await waitUntil(() => controller.font.isResolved);
    assert.strictEqual(
      controller.font.value?.names.fontFamily['en'],
      'mocked_my-font.file_100',
      'Font was load on model',
    );
  });

  test('it generate a STL with mesh', async function (assert) {
    assert.expect(7);
    const controller = this.owner.lookup('controller:app/generator') as GeneratorController;

    const model = mockTextSettings({
      fontName: 'the_font',
      variantName: '100',
    });

    controller.model = model;

    const mockedFont = mockFont('a_font', '100');
    const mockedMesh = new Mesh();

    this.owner.lookup('service:font-manager').fetchFont = async function () {
      return mockedFont;
    };

    this.owner.lookup('service:text-maker').generateMesh = function (
      settings: TextMakerParameters,
      font: Font,
    ) {
      assert.strictEqual(settings, model, 'it generate mesh with model settings');
      assert.strictEqual(font, mockedFont, 'it generate mesh with fetched font');
      return mockedMesh;
    };

    this.owner.lookup('service:file-exporter').downloadMeshFile = function (
      mesh: Mesh,
      type: string | undefined,
    ) {
      assert.strictEqual(mesh, mockedMesh, 'it generates FILE from mesh');
      assert.strictEqual(type, 'stl', 'it generates STL by default');
    };

    controller._gtag = function (type: string, eventName: string, opts: { value: string }) {
      assert.step(`gtag_${type}_${eventName}_${opts.value}`);
    } as unknown as typeof gtag;

    // Wait for the font to be load
    await waitUntil(() => controller.font.isResolved);

    await controller.exportFile();
    assert.verifySteps(['gtag_event_stl_generation_2', 'gtag_event_file_download_stl']);
  });
});
