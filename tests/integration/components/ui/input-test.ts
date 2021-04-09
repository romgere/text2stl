import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, fillIn } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | ui/input', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {

    this.set('value', 'initial')
    this.set('type', undefined)

    await render(hbs`<Ui::Input data-test-custom-attr 
      @value={{this.value}}
      @onChange={{fn (mut this.value)}}
      @placeholder="Enter text"
      @type={{this.type}}
    />`)

    assert
      .dom('input')
      .exists('It renders an input')
      .hasAttribute('type', 'text', 'Input has "text" type by default')
      .hasAttribute('data-test-custom-attr', '', 'Custom attributes are handled')
      .hasValue('initial', 'input has correct value')
      .hasAttribute('placeholder', 'Enter text', 'Placeholder attribute is correct')

    this.set('type', 'number')
    assert
      .dom('input')
      .hasAttribute('type', 'number', 'type parameter can be specified')

    await fillIn('input', '1234')

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

    await render(hbs`<Ui::Input @debounce={{250}} @value={{this.value}} @onChange={{this.onChange}} />`)

    fillIn('input', '1')
    fillIn('input', '12')
    fillIn('input', '123')
    fillIn('input', '1234')
  })
})
