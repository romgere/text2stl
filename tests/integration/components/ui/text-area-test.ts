import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, fillIn } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | ui/text-area', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {

    this.set('value', 'initial')
    this.set('type', undefined)

    await render(hbs`<Ui::TextArea data-test-custom-attr 
      @value={{this.value}}
      @onChange={{fn (mut this.value)}}
      @placeholder="Enter text"
    />`)

    assert
      .dom('textarea')
      .exists('It renders a textarea')
      .hasAttribute('data-test-custom-attr', '', 'Custom attributes are handled')
      .hasValue('initial', 'input has correct value')
      .hasAttribute('placeholder', 'Enter text', 'Placeholder attribute is correct')

    await fillIn('textarea', '1234')

    assert.equal(
      this.get('value'), // eslint-disable-line ember/no-get
      '1234',
      'It handles value update'
    )
  })

  test('it can be debounced', async function(assert) {
    assert.expect(1)
    let onChangeDone = assert.async()

    this.set('value', 'initial')
    this.set('onChange', (value: string) => {
      assert.equal(value, '1234')
      this.set('value', value)
      onChangeDone()
    })

    await render(hbs`<Ui::TextArea @debounce={{250}} @value={{this.value}} @onChange={{this.onChange}} />`)

    fillIn('textarea', '1')
    fillIn('textarea', '12')
    fillIn('textarea', '123')
    fillIn('textarea', '1234')
  })
})
