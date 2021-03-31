import { module } from 'qunit'
import { setupTest } from 'ember-qunit'
import cases from 'qunit-parameterize'
import type STLExporterService from 'text2stl/services/stl-exporter'
import type { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import type { Mesh } from 'three'

module('Unit | Service | stl-exporter', function(hooks) {
  setupTest(hooks)

  cases([
    { binary: true, title: 'binary' },
    { binary: false, title: 'not binary' }
  ]).test('downloadMeshAsSTL works (binary)', function({ binary }, assert) {

    let service = this.owner.lookup('service:stl-exporter') as STLExporterService

    service.downloadBlob = async function(blob: Blob, name: string) {
      assert.equal(
        blob.type,
        binary ? 'application/octet-stream' : 'text/plain',
        'blob has correct type'
      )
      assert.equal(name, 'custom-name.stl', 'blob has correct name')
      assert.equal(await blob.text(), 'stl_content', 'blob contains STL')
    }

    service.exporter = {
      parse(mesh: string, args: any) {
        assert.equal(mesh, 'a_mesh', 'IT calls STLExporter with mesh')
        assert.equal(args.binary, binary, 'It calls STLExporter with correct binary option')
        return 'stl_content'
      }
    } as unknown as STLExporter

    service.downloadMeshAsSTL('a_mesh' as unknown as Mesh, 'custom-name.stl', binary)
  })
})

