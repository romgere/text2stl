import Modifier, { ArgsFor } from 'ember-modifier'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { tracked } from '@glimmer/tracking'
import config from 'text2stl/config/environment'
import { registerDestructor } from '@ember/destroyable'
import { action } from '@ember/object'

const {
  APP: { threePreviewSettings }
} = config

type namedArgs = {
  parentSize?: boolean,
  nearCamera?:boolean
}

interface ThreeRendererModifierSignature {
  Args: {
    Positional: [THREE.Mesh | undefined];
    Named: namedArgs;
  };
}

export default class ThreeRendererModifier extends Modifier<ThreeRendererModifierSignature> {

  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  mesh?: THREE.Mesh

  controls?: OrbitControls

  @tracked
  meshSize?: { x: number, y: number, z: number }

  rendererSize: { width: number, height: number } = { width: 0, height: 0 }

  container?: HTMLDivElement
  namedArgs: namedArgs;
  animationFrameRequestID ?: number;

  constructor(owner: unknown, args: ArgsFor<ThreeRendererModifierSignature>) {
    super(owner, args)

    this.namedArgs = args.named
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(threePreviewSettings.backgroundColor)

    // Lights
    ;[
      { x: 0, y: 200, z: 0 },
      { x: 100, y: 200, z: 100 },
      { x: -100, y: -200, z: -100 }
    ].forEach(({ x, y, z }) => this.addLight(x, y, z))

    // Camera
    this.camera = new THREE.PerspectiveCamera(75)
    this.camera.position.set(
      0,
      this.namedArgs.nearCamera ? 50 : 400,
      this.namedArgs.nearCamera ? 70 : 300
    )
    this.scene.add(this.camera)

    // Decorators (grid, ground, ...)
    this.addDecorators()

    // WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true // use this to allow creation of image from canvas
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(
      this.namedArgs.parentSize ? 1 : 1024,
      this.namedArgs.parentSize ? 1 : 768
    )
    this.renderer.setClearColor(0xffffff, 1)

    registerDestructor(this, this.cleanup)
  }

  @action
  cleanup() {
    if (this.animationFrameRequestID) {
      cancelAnimationFrame(this.animationFrameRequestID)
    }

    this.container = undefined
  }

  private addLight(x: number, y: number, z: number) {
    let l = new THREE.PointLight(0xffffff, 0.7, 0)
    l.position.set(x, y, z)
    this.scene.add(l)
  }

  private addDecorators() {

    let ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: threePreviewSettings.groundColor, depthWrite: false })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    let grid = new THREE.GridHelper(
      threePreviewSettings.gridSize,
      threePreviewSettings.gridDivisions,
      threePreviewSettings.gridColor1,
      threePreviewSettings.gridColor2
    )
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
  }

  private updateMesh(mesh?: THREE.Mesh) {

    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh = undefined
    }

    if (!mesh) {
      return
    }

    this.mesh =  mesh.clone() as THREE.Mesh

    let { min, max } = new THREE.Box3().setFromObject(this.mesh)
    this.meshSize = {
      x: max.x - min.x,
      y: max.y - min.y,
      z: max.z - min.z
    }

    // Rotate & Center mesh
    this.mesh.rotation.x = -Math.PI / 2

    let xCenter = min.x + (this.meshSize.x / 2)
    this.mesh.position.x = -xCenter

    let zCenter = min.y + (this.meshSize.y / 2) // Use y size here as mesh is rotate
    this.mesh.position.z = zCenter

    this.scene.add(this.mesh)
  }

  private renderFrame() {
    if (!this.container) {
      return
    }

    this.animationFrameRequestID = requestAnimationFrame(() => this.renderFrame())

    let { offsetWidth: width, offsetHeight: height } = this.namedArgs.parentSize
      ? this.container?.parentElement ?? this.container
      : this.container

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

  modify(element: HTMLDivElement, [mesh]: [THREE.Mesh | undefined], { parentSize, nearCamera } : namedArgs) {
    this.namedArgs = { parentSize, nearCamera }

    if (!this.container) {
      this.container = element
      this.initContainer()
      this.renderFrame()
    }

    this.updateMesh(mesh)
  }
}