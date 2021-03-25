import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Controller | application', function(hooks) {
  setupTest(hooks)

  test('it handles font change & font loading', async function(assert) {

    assert.expect(4)

    let controller = this.owner.lookup('controller:application')

    controller.model = {
      settings: {
        fontName: 'my-font',
        variantName: 'a-variant',
        fontSize: 'very big',
        font: undefined
      }
    }

    this.owner.lookup('service:font-manager').fetchFont = async function(name: string, variant: string, size: string) {
      assert.equal(name, 'my-font', 'it requires correct fontName')
      assert.equal(variant, 'a-variant', 'it requires correct variantName')
      assert.equal(size, 'very big', 'it requires correct fontSize')

      return 'a_font'
    }

    await controller.onFontChange()

    assert.equal(controller.model.settings.font, 'a_font', 'Font was update on model')
  })

  test('it generate a STL with mesh', async function(assert) {

    assert.expect(2)

    let controller = this.owner.lookup('controller:application')

    controller.model = {
      settings: 'model-settings'
    }

    this.owner.lookup('service:stl-exporter').downloadMeshAsSTL = function(mesh: string) {
      assert.equal(mesh, 'mesh_de_cheveux', 'it generates STL from mesh')
    }

    this.owner.lookup('service:text-maker').generateMesh = function(settings: string) {
      assert.equal(settings, 'model-settings', 'it generate mesh with model settings')
      return 'mesh_de_cheveux'
    }

    controller.exportSTL()
  })
})
