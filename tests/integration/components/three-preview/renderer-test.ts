import { module, skip } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, find } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import cases from 'qunit-parameterize'
import { Mesh, BoxGeometry } from 'three'
// import testCases from 'text2stl/tests/fixtures/meshs/renderer_tests'

module('Integration | Component | three-preview/renderer', function(hooks) {
  setupRenderingTest(hooks)

  // parentSize?: boolean;
  // ?: boolean;

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

  // Skip as CI generated snapshot are not equal to local snapshots
  // cases(testCases).
  skip('it renders mesh as expected', async function({ nearCamera, mesh, snapshot: expectedSnapshot }, assert) {

    this.set('nearCamera', nearCamera)
    this.set('mesh', mesh)
    await render(hbs`<div style="width: 500px; height: 500px">
      <ThreePreview::Renderer @mesh={{this.mesh}} @nearCamera={{this.nearCamera}} @parentSize={{true}} />
    </div>`)

    assert.equal(this.element.textContent?.trim(), '')

    let canvas = find('canvas') as HTMLCanvasElement | undefined
    let canvasSnapshot = canvas?.toDataURL()

    assert.equal(
      canvasSnapshot,
      expectedSnapshot,
      'Mesh is rendered according to snapshot'
    )
  })
})
