import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Service | text-maker', function(hooks) {
  setupTest(hooks)

  test('it generate mesh', function(assert) {
    let service = this.owner.lookup('service:text-maker')
    //service.generateMesh
    // use fixtures ?
  })
})

