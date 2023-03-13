import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import waitUntil from '@ember/test-helpers/wait-until'

module('Unit | Controller | app/generator', function(hooks) {
  setupTest(hooks)

  test('it handles font change & font loading (google font)', async function(assert) {

    assert.expect(6)

    let controller = this.owner.lookup('controller:app/generator')

    this.owner.lookup('service:font-manager').fetchFont = async function(name: string, variant: string) {
      assert.equal(name, controller.model.fontName, 'it requires correct fontName')
      assert.equal(variant, controller.model.variantName, 'it requires correct variantName')

      return `loaded_${name}_${variant}`
    }

    controller.model = {
      fontName: 'my-font',
      variantName: 'a-variant',
      font: undefined
    }
    // Wait for the font to be load
    await waitUntil(() => controller.font.isResolved)
    assert.equal(controller.font.value, 'loaded_my-font_a-variant', 'Font was load on model')

    controller.model = {
      fontName: 'another-font',
      variantName: 'another-variant',
      font: undefined
    }
    // Wait for the font to be load
    await waitUntil(() => controller.font.isResolved)
    assert.equal(controller.font.value, 'loaded_another-font_another-variant', 'Font was load on model')
  })

  test('it handles font change & font loading (custom font)', async function(assert) {

    assert.expect(2)
    this.owner.lookup('service:font-manager').loadCustomFont = async function(file: string) {
      return `loaded_${file}`
    }

    let controller = this.owner.lookup('controller:app/generator')

    controller.model = {
      customFont: 'my-font.file',
      variantName: undefined,
      font: undefined
    }
    // Wait for the font to be load
    await waitUntil(() => controller.font.isResolved)
    assert.equal(controller.font.value, 'loaded_my-font.file', 'Font was load on model')

    // await controller.onFontChange()
    controller.model = {
      customFont: 'another-font.file',
      variantName: undefined,
      font: undefined
    }
    // Wait for the font to be load
    await waitUntil(() => controller.font.isResolved)
    assert.equal(controller.font.value, 'loaded_another-font.file', 'Font was load on model')
  })

  test('it generate a STL with mesh', async function(assert) {

    assert.expect(8)

    let controller = this.owner.lookup('controller:app/generator')

    let model = {
      type: 'tipi',
      fontName: 'the_font',
      variantName: 'a_variant'
    }
    controller.model = model

    this.owner.lookup('service:font-manager').fetchFont = async function(name: string, variant: string) {
      assert.equal(name, 'the_font', 'it fetch correct font name')
      assert.equal(variant, 'a_variant', 'it fetch correct font variant')
      return 'a_super_font'
    }

    this.owner.lookup('service:stl-exporter').downloadMeshAsSTL = function(mesh: string) {
      assert.equal(mesh, 'mesh_de_cheveux', 'it generates STL from mesh')
    }

    this.owner.lookup('service:text-maker').generateMesh = function(settings: any, font: string) {
      assert.strictEqual(settings, model, 'it generate mesh with model settings')
      assert.strictEqual(font, 'a_super_font', 'it generate mesh with fetched font')
      return 'mesh_de_cheveux'
    }

    controller._gtag = function(type: string, eventName: string, opts: any) {
      assert.step(`gtag_${type}_${eventName}_${opts.value}`)
    }

    // Wait for the font to be load
    await waitUntil(() => controller.font.isResolved)

    await controller.exportSTL()
    assert.verifySteps([
      'gtag_event_stl_generation_tipi',
      'gtag_event_stl_download_tipi'
    ])
  })
})
