import { module, skip } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | ui/font-picker/select', function(hooks) {
  setupRenderingTest(hooks)

  skip('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{ui/font-picker/select}}`)

    assert.equal(this.element.textContent?.trim(), '')

    // Template block usage:
    await render(hbs`
      {{#ui/font-picker/select}}
        template block text
      {{/ui/font-picker/select}}
    `)

    assert.equal(this.element.textContent?.trim(), 'template block text')
  })
})
