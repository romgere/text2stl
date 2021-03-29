import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, click } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | ui/type-select', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {
    let onChangeDone = assert.async()
    this.set('current', 3)
    this.set('onChange', (value: number) => {
      onChangeDone()
      this.set('current', value)
      assert.equal(value, 1, 'onChange is called with new value')
    })

    await render(hbs`<Ui::TypeSelect @value={{this.current}} @onChange={{this.onChange}} data-custom-attrs="hello" />`)

    assert.dom('.uk-grid-small')
      .exists('It render a small grid')
      .hasAttribute('data-custom-attrs', 'hello', 'customs attribute is applied')

    assert.dom('input[type="radio"]').exists({ count: 4 }, 'There is 4 options')
    assert.dom('input[type="radio"]:not(:checked)').exists({ count: 3 }, 'There is 3 selected options')
    assert.dom('[data-test-type-item="3"]').isChecked('Correct item is selected')

    await click('[data-test-type-item="1"]')
    assert.dom('[data-test-type-item="1"]').isChecked('Correct item is selected')
  })
})
