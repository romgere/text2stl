import { module } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import cases from 'qunit-parameterize'
import { Mesh, BoxGeometry } from 'three'

module('Integration | Component | three-preview/renderer', function(hooks) {
  setupRenderingTest(hooks)

  cases([
    { parentSize: true, title: 'with parentSize true' },
    { parentSize: false, title: 'with parentSize false' }
  ]).test('it handle parentSize attribute', async function({ parentSize }, assert) {

    this.set('parentSize', parentSize)
    this.set('mesh', new Mesh(new BoxGeometry(12.12, 34.07, 56.42)))

    await render(hbs`<div style="width: 200px; height: 100px">
      <ThreePreview::Renderer @mesh={{this.mesh}} @parentSize={{this.parentSize}} data-test-renderer />
    </div>`)

    if (parentSize) {
      assert
        .dom('[data-test-renderer] canvas')
        .hasAttribute('width', '200', 'Canvas width is adapted to parent size')
        .hasAttribute('height', '100', 'Canvas height is adapted to parent size')
    } else {
      assert
        .dom('[data-test-renderer] canvas')
        .hasAttribute('width', '200', 'Canvas width is adapted to parent size')
        .hasAttribute('height', '768', 'Canvas height is 768')
    }
  })
})
