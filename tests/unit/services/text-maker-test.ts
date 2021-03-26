import { module } from 'qunit'
import { setupTest } from 'ember-qunit'
import * as opentype from 'opentype.js'

import fonts from 'text2stl/tests/fixtures/fonts'
import meshTests from 'text2stl/tests/fixtures/meshs/tests'
import meshFixture from 'text2stl/tests/fixtures/meshs/snapshots/index'
import cases from 'qunit-parameterize'
import type TextMakerService from 'text2stl/services/text-maker'

function objectToCompareString(mesh: Object) {
  let json = JSON.stringify(mesh)

  return json.replace(
    /"uuid":"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"/g,
    '"uuid":""'
  )

}

module('Unit | Service | text-maker', function(hooks) {
  setupTest(hooks)

  cases(
    Object.keys(meshTests).map((name: keyof typeof meshTests) => ({
      settings: meshTests[name],
      outputMesh: meshFixture[name],
      title: `Mesh fixture "${name}"`
    }))
  ).test('it generate mesh according to snapshots', async function({ settings, outputMesh }, assert) {

    let res = await fetch(fonts[settings.font])
    let fontData = await res.arrayBuffer()

    let service = this.owner.lookup('service:text-maker') as TextMakerService

    let mesh = service.generateMesh({
      ...settings,
      font: opentype.parse(fontData)
    })

    assert.equal(
      objectToCompareString(mesh.toJSON().geometries),
      objectToCompareString(outputMesh.geometries),
      'Mesh is conform to fixture'
    )
  })
})

