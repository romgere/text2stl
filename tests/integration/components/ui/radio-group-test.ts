import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render, click } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

const options = ['a', 'b', 'c']
module('Integration | Component | ui/radio-group', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders', async function(assert) {
    this.set('options', options)
    this.set('checked', 'b')

    await render(hbs`<Ui::radio-group
      @options={{this.options}}
      @checked={{this.checked}}
      @onChange={{fn (mut this.checked)}}
      @radioName={{this.radioName}}
    as |value|>label for {{value}}</Ui::radio-group>`)

    assert
      .dom('input[type="radio"]')
      .exists({ count: 3 }, 'It renders radios')
      .hasAttribute('name', /radio-ember[0-9]*/, 'It generate name for radio when @radioName is not specified')

    assert.dom('input[value="b"]').isChecked('default value is checked')
    assert.dom('label:first-child').hasText('label for a', 'it yield radio value & allow custom label')

    this.set('radioName', 'gaga')
    assert
      .dom('input[type="radio"]')
      .hasAttribute('name', 'gaga', 'It take @radioName as radio name when specified')

    await click('input[value="c"]')

    assert.equal(
      this.get('checked'), // eslint-disable-line ember/no-get
      'c',
      'It handles value update'
    )
  })
})
