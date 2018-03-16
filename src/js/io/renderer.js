export default class Renderer {
  constructor ({
    alpha = true,
    pixelRatio = window.devicePixelRatio,
    width = window.width,
    height = window.height,
    container
  }) {
    this.renderer = new THREE.WebGLRenderer({ alpha })
    const gl = this.renderer.context
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    this.setPixelRatio(pixelRatio)

    this.setSize(width, height)

    container.appendChild(this.getDomElement())
    window.addEventListener('resize', this.onWindowResize.bind(this))
  }

  getDomElement (container) {
    return this.renderer.domElement
  }

  onWindowResize () {
    const WIDTH = window.innerWidth
    const HEIGHT = window.innerHeight

    this.renderer.setSize(WIDTH, HEIGHT)
  }

  setPixelRatio (pixelRatio) {
    this.renderer.setPixelRatio(pixelRatio)
  }

  setSize (w, h) {
    this.renderer.setSize(w, h)
  }

  render ({
    scene,
    camera,
    renderTarget = null,
    force = false
  } = {}) {
    this.renderer.render(scene, camera, renderTarget, force)
  }

  get () {
    return this.renderer
  }
}
