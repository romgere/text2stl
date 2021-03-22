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
  camera: THREE.Camera
  renderer: THREE.WebGLRenderer
  mesh?: THREE.Mesh
  geometry?: THREE.ExtrudeGeometry

  controls?: OrbitControls

  container?: HTMLDivElement

  constructor(owner: unknown, args: ThreePreviewArgs) {
    super(owner, args)

    this.scene = new THREE.Scene()

    // Lights
    let lights: THREE.Light[] = []
    lights[0] = new THREE.PointLight(0xffffff, 1, 0)
    lights[1] = new THREE.PointLight(0xffffff, 1, 0)
    lights[2] = new THREE.PointLight(0xffffff, 1, 0)
    lights[0].position.set(0, 200, 0)
    lights[1].position.set(100, 200, 100)
    lights[2].position.set(-100, -200, -100)
    this.scene.add(lights[0])
    this.scene.add(lights[1])
    this.scene.add(lights[2])

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      1024 / 768,
      0.1,
      10000
    )
    this.camera.position.z = 200
    this.scene.add(this.camera)

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(1024, 768) // @TODO
    this.renderer.setClearColor(0xffffff, 1)
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
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide
      })
    )
    this.scene.add(this.mesh)

    this.args.registerMesh?.(this.mesh)
  }

  renderFrame() {
    if (!this.active) {
      return
    }

    requestAnimationFrame(() => this.renderFrame())

    // Deal with resize ?
    // if (this.container) {
    //   if (this.size === undefined || this.size.width !== this.container.offsetWidth || this.size.height !== this.container.offsetHeight) {
    //     this.size = {
    //       width: this.container.offsetWidth,
    //       height: this.container.offsetHeight,
    //     };
    //     this.renderer.setSize(this.size.width, this.size.height);
    //     this.camera.aspect = this.size.width / this.size.height;
    //     this.camera.updateProjectionMatrix();
    //   }
    // }

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
