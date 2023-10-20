import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { Mesh, BoxGeometry } from 'three';

module('Integration | Component | three-preview/renderer', function (hooks) {
  setupRenderingTest(hooks);

  for (const { parentSize, title } of [
    { parentSize: true, title: 'with parentSize true' },
    { parentSize: false, title: 'with parentSize false' },
  ]) {
    test(`it handle parentSize attribute [${title}]`, async function (assert) {
      this.set('parentSize', parentSize);
      this.set('mesh', new Mesh(new BoxGeometry(12.12, 34.07, 56.42)));

      await render(hbs`<div style="width: 200px; height: 100px" data-test-renderer>
        <ThreePreview::Renderer @mesh={{this.mesh}} @parentSize={{this.parentSize}} />
      </div>`);

      if (parentSize) {
        assert
          .dom('[data-test-renderer] canvas')
          .hasAttribute('width', '200', 'Canvas width is adapted to parent size')
          .hasAttribute('height', '100', 'Canvas height is adapted to parent size');
      } else {
        assert
          .dom('[data-test-renderer] canvas')
          .hasAttribute('width', '1024', 'Canvas width is 1024')
          .hasAttribute('height', '768', 'Canvas height is 768');
      }
    });
  }
});
