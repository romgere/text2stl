import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Service | font-manager', function(hooks) {
  setupTest(hooks)

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:font-manager')
    assert.ok(service)
  })

  test('it returns font name list', function(assert) {

  })

  test('it fetch font', function(assert) {
    // with variant & size
    // first available size when fontsize don't exist
    // first available variant & size when variant don't exist
  })

  test('it cache font', function(assert) {

  })
})

