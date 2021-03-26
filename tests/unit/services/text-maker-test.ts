import { module } from 'qunit'
import { setupTest } from 'ember-qunit'
import * as opentype from 'opentype.js'

import fonts from 'text2stl/tests/fixtures/font'
import meshTests from 'text2stl/tests/fixtures/mesh'
import meshFixture from 'text2stl/tests/fixtures/mesh/index'

import cases from 'qunit-parameterize'

module('Unit | Service | text-maker', function(hooks) {
  setupTest(hooks)

  cases(
    Object.keys(meshTests).map((name: keyof typeof meshTests) => ({
      settings: meshTests[name],
      outputMesh: meshFixture[name],
      title: `Mesh fixture "${name}"`
    }))
  ).test('it generate mesh', async function({ settings, outputMesh }, assert) {

    let res = await fetch(fonts[settings.font])
    let fontData = await res.arrayBuffer()
    settings.font = opentype.parse(fontData)

    let service = this.owner.lookup('service:text-maker')

    let mesh = service.generateMesh(settings)
debugger
    assert.deepEqual(
      mesh.toJSON().geometries,
      outputMesh.geometries,
      'Mesh is conform to fixture'
    )
  })
})

