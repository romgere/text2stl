import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Service | text-maker', function(hooks) {
  setupTest(hooks)

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:text-maker')
    assert.ok(service)
  })
})

