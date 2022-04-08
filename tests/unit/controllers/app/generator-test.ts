import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Controller | app/generator', function(hooks) {
  setupTest(hooks)

  test('it handles font change & font loading (google font)', async function(assert) {

    assert.expect(4)

    let controller = this.owner.lookup('controller:app/generator')

    controller.model = {
      fontName: 'my-font',
      variantName: 'a-variant',
      fontSize: 'very big',
      font: undefined
    }

    this.owner.lookup('service:font-manager').fetchFont = async function(name: string, variant: string, size: string) {
      assert.equal(name, 'my-font', 'it requires correct fontName')
      assert.equal(variant, 'a-variant', 'it requires correct variantName')
      assert.equal(size, 'very big', 'it requires correct fontSize')

      return 'a_font'
    }

    await controller.onFontChange()

    assert.equal(controller.model.font, 'a_font', 'Font was update on model')
  })

  test('it handles font change & font loading (custom font)', async function(assert) {

    assert.expect(2)

    let controller = this.owner.lookup('controller:app/generator')

    controller.model = {
      customFont: 'my-font.file',
      variantName: undefined,
      fontSize: undefined,
      font: undefined
    }

    this.owner.lookup('service:font-manager').loadCustomFont = async function(file: string) {
      assert.equal(file, 'my-font.file', 'it loads correct font file')
      return 'a_custom_font'
    }

    await controller.onFontChange()

    assert.equal(controller.model.font, 'a_custom_font', 'Font was update on model')
  })

  test('it generate a STL with mesh', async function(assert) {

    assert.expect(5)

    let controller = this.owner.lookup('controller:app/generator')

    let model = { type: 'tipi' }
    controller.model = model

    this.owner.lookup('service:stl-exporter').downloadMeshAsSTL = function(mesh: string) {
      assert.equal(mesh, 'mesh_de_cheveux', 'it generates STL from mesh')
    }

    this.owner.lookup('service:text-maker').generateMesh = function(settings: any) {
      assert.strictEqual(settings, model, 'it generate mesh with model settings')
      return 'mesh_de_cheveux'
    }

    controller._gtag = function(type: string, eventName: string, opts: any) {
      assert.step(`gtag_${type}_${eventName}_${opts.value}`)
    }

    controller.exportSTL()
    assert.verifySteps([
      'gtag_event_stl_generation_tipi',
      'gtag_event_stl_download_tipi'
    ])
  })
})
