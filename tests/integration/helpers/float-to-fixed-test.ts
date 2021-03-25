import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Helper | float-to-fixed', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {
    this.set('inputValue', 1.234)
    await render(hbs`{{float-to-fixed this.inputValue}}`)
    assert.equal(this.element.textContent?.trim(), '1.23')
  })
})
