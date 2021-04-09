import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
// eslint-disable-next-line ember/no-classic-components
import Component from '@ember/component'

module('Integration | Component | three-preview', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {
    this.owner.register(
      'component:three-preview/renderer',
      class extends Component {
        layout = hbs`<div three-preview-renderer data-mesh={{@mesh}} />`
      }
    )
    this.owner.register(
      'component:three-preview/size',
      class extends Component {
        layout = hbs`<div three-preview-size data-mesh={{@mesh}} />`
      }
    )

    await render(hbs`<ThreePreview @mesh="my_mesh" as |preview|>
      <preview.renderer />
      <preview.size />
    </ThreePreview>`)

    assert
      .dom('[three-preview-renderer]')
      .exists('It yield the "renderer" component')
      .hasAttribute('data-mesh', 'my_mesh', 'Mesh is passed to "renderer" child component')
    assert
      .dom('[three-preview-size]')
      .exists('It yield the "size" component')
      .hasAttribute('data-mesh', 'my_mesh', 'Mesh is passed to "size" child component')
  })
})
