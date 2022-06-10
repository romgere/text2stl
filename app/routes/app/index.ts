import Route from '@ember/routing/route'
import * as THREE from 'three'

let loader : THREE.ObjectLoader | undefined = undefined

function loadJSONMesh(path: string) :Promise<THREE.Object3D> {

  if (!loader) {
    loader = new THREE.ObjectLoader()
  }

  return new Promise(function(resolve, reject) {
    loader?.load(path, resolve, () => {}, reject)
  })
}

export default class AppIndex extends Route {
  async model() {
    return [
      await loadJSONMesh('/mesh/1.json'),
      await loadJSONMesh('/mesh/2.json'),
      await loadJSONMesh('/mesh/3.json'),
      await loadJSONMesh('/mesh/4.json'),
      await loadJSONMesh('/mesh/5.json')
    ]
  }

  afterModel() {
    document.querySelector('#app-loader')?.remove()
  }
}
