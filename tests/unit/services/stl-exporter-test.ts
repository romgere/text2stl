import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Service | stl-exporter', function(hooks) {
  setupTest(hooks)

  test('meshToBlob works', function(assert) {
    let service = this.owner.lookup('service:stl-exporter')
  })

  test('downloadBlob works', function(assert) {
  })

  test('downloadMeshAsSTL works', function(assert) {
  })
})

