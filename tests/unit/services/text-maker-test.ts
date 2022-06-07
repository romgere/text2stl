import { module } from 'qunit'
import { setupTest } from 'ember-qunit'
import loadFont from 'text2stl/tests/helpers/load-font'
import meshTests from 'text2stl/tests/fixtures/meshs/tests'
import meshFixture from 'text2stl/tests/fixtures/meshs/snapshots/index'
import cases from 'qunit-parameterize'
import type TextMakerService from 'text2stl/services/text-maker'
import type { TextMakerParameters } from 'text2stl/services/text-maker'

function objectToCompareString(mesh: Object | undefined) {
  if (!mesh) {
    return ''
  }

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
      snapshot: meshFixture[name],
      title: `Mesh fixture "${name}"`,
      name
    }))
  ).test('it generate mesh according to snapshots', async function({ settings, snapshot, name }, assert) {

    let service = this.owner.lookup('service:text-maker') as TextMakerService

    let mesh = service.generateMesh({
      ...settings as unknown as  TextMakerParameters,
      font: await loadFont(settings.font)
    })

    let generatedCompare = objectToCompareString(mesh?.toJSON()?.geometries)
    let snapshotCompare = objectToCompareString(snapshot?.geometries)

    if (generatedCompare !== snapshotCompare) {
      console.warn(`New mesh snapshot needed for fixture "${name}" ?`)

      let fileContent = `export default ${JSON.stringify(mesh?.toJSON())}`
      let blob = new Blob([fileContent], {
        type: 'text/plain'
      })
      let url = URL.createObjectURL(blob)

      if (window.location.hash.substr(1) === 'download_fixture') {
        let link = document.createElement('a')
        link.setAttribute('download', `${name}.ts`)
        link.setAttribute('href', url)
        link.setAttribute('target', '_blank')
        link.setAttribute('rel', 'noopener noreferrer')

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        URL.revokeObjectURL(url)
      }

      console.warn(`If needed, write the following content to tests/fixtures/meshs/snapshots/${name}.ts`, url)
    }

    assert.equal(
      generatedCompare,
      snapshotCompare,
      'Mesh is conform to fixture'
    )
  })
})

