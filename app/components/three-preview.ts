import Component from '@glimmer/component'
import { action } from '@ember/object'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface ThreePreviewArgs {
  geometry?: THREE.BufferGeometry;
  registerMesh?: (mesh: THREE.Mesh) => void;
}

export default class ThreePreview extends Component<ThreePreviewArgs> {

  active: boolean = false

  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  mesh?: THREE.Mesh
  geometry?: THREE.ExtrudeGeometry

  controls?: OrbitControls

  container?: HTMLDivElement

  rendererSize: { width: number, height: number } = { width: 0, height: 0 }

  constructor(owner: unknown, args: ThreePreviewArgs) {
    super(owner, args)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xe1e8f5)

    // Lights
    ;[
      { x: 0, y: 200, z: 0 },
      { x: 100, y: 200, z: 100 },
      { x: -100, y: -200, z: -100 }
    ].forEach(({ x, y, z }) => this.addLight(x, y, z))

    // Camera
    this.camera = new THREE.PerspectiveCamera(75)
    this.camera.position.set(0, 400, 300)
    this.scene.add(this.camera)

    // Decorators (grid, ground, ...)
    this.addDecorators()

    // WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(1024, 768) // @TODO
    this.renderer.setClearColor(0xffffff, 1)

  }

  private addLight(x: number, y: number, z: number) {
    let l = new THREE.PointLight(0xffffff, 0.7, 0)
    l.position.set(x, y, z)
    this.scene.add(l)
  }

  private addDecorators() {

    let ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    let grid = new THREE.GridHelper(2000, 100, 0x3187f0, 0xf1f1f1)
    this.scene.add(grid)
  }

  private initContainer() {
    if (!this.container) {
      return
    }

    this.container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )

    this.controls.maxPolarAngle = Math.PI * 1
    this.controls.minDistance = 50
    this.controls.maxDistance = 1000

    this.updateGeometry()

    this.active = true
  }

  updateGeometry() {

    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh = undefined
    }

    this.mesh = new THREE.Mesh(
      this.args.geometry ?? new THREE.SphereGeometry(60, 8, 8),
      new THREE.MeshPhongMaterial({
        color: 0xfa7f01,
        // emissive: 0x00ff00,
        side: THREE.DoubleSide
      })
    )

    // Rotate & Center mesh
    this.mesh.rotation.x = -Math.PI / 2

    let { min, max } = new THREE.Box3().setFromObject(this.mesh)
    console.log(min, max)
    console.log(this.mesh.position)

    let xCenter = min.x + ((max.x - min.x) / 2)
    this.mesh.position.x = -xCenter

    let zCenter = min.z + ((max.z - min.z) / 2)
    this.mesh.position.z = -zCenter

    this.scene.add(this.mesh)

    this.args.registerMesh?.(this.mesh)
  }

  renderFrame() {
    if (!this.active || !this.container) {
      return
    }

    requestAnimationFrame(() => this.renderFrame())

    let { offsetWidth: width, offsetHeight: height } = this.container
    if (this.rendererSize.width !== width || this.rendererSize.height !== height) {

      this.renderer.setSize(width, height)
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()

      this.rendererSize = {
        width,
        height
      }
    }

    this.camera.lookAt(this.scene.position)
    this.renderer.render(this.scene, this.camera)
  }

  @action
  didInsertAction(element: HTMLDivElement) {
    this.container = element
    this.initContainer()

    this.renderFrame()
  }

  @action
  didUpdateAction() {
    this.updateGeometry()
  }
}
