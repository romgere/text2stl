import Service from '@ember/service'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'

import type { Mesh } from 'three'

export default class STLExporterService extends Service {

  exporter: STLExporter

  constructor() {
    super()
    this.exporter = new STLExporter()
  }

  meshToBlob(mesh: Mesh, binary: boolean): Blob {
    let result = this.exporter.parse(mesh, { binary })
    return new Blob([result], {
      type: binary ? 'application/octet-stream' : 'text/plain'
    })
  }

  downloadBlob(blob: Blob, name: string) {

    let link = document.createElement('a')
    link.style.display = 'none'
    document.body.appendChild(link)

    link.href = URL.createObjectURL(blob)
    link.download = name
    link.click()
  }

  downloadMeshAsSTL(mesh: Mesh, name: string = 'output.stl', binary: boolean = true) {
    this.downloadBlob(
      this.meshToBlob(mesh, binary),
      name
    )
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'stl-exporter': STLExporterService
  }
}
