import FBO from 'three.js-fbo'

import { simulationVertexShader, simulationFragmentShader } from '../shaders/simulationShaders'
import { vertexShader, fragmentShader } from '../shaders/shaders'

export default class Particles {
  constructor ({
    scene,
    numParticles = 100000,
    uniforms = {
      sizeMultipler: { value: (window.innerHeight * window.devicePixelRatio) / 2 },
      color: { value: new THREE.Color(0xffffff) }
    },
    blending = THREE.AdditiveBlending,
    transparent = true,
    depthTest = true,
    depthWrite = false,

    renderer,

    particleSize = 0.06,
    particleSizeInc = 0.00005,
    zInc = 0.0003,
    yInc = 0.0007,
    yThreshold = 0.2
  }) {
    this.scene = scene
    this.numParticles = numParticles
    this.renderer = renderer
    this.uniforms = uniforms

    this.particleSize = particleSize
    this.particleSizeInc = particleSizeInc
    this.zInc = zInc
    this.yInc = yInc
    this.yThreshold = yThreshold

    this.windowHalfX = window.innerWidth / 2
    this.windowHalfY = window.innerHeight / 2

    this.video = document.createElement('video')

    const noSupport = document.createElement('h1')
    noSupport.innerHTML = 'Your browser is not supported. Please use Google Chrome (v21 or above).'

    navigator.getUserMedia
      ? navigator.getUserMedia({ video: { width: 1280, height: 720 } }, stream => {
        const video = this.video
        video.src = URL.createObjectURL(stream) // eslint-disable-line
        video.width = 480
        video.height = 480

        this.addParticles()
      }, () => console.error('video failed to load'))
      : document.getElementsByTagName('body')[0].append(noSupport)
  }

  onDocumentMouseMove (event) {
    this.mouseX = this.windowHalfX - event.clientX
    this.mouseY = event.clientY - this.windowHalfY

    this.FBO.simulationShader.uniforms.mouse.value.set(0.5 * this.mouseX / this.windowHalfX, -0.5 * this.mouseY / this.windowHalfY, 0)
  }

  addParticles () {
    const video = this.video
    const renderer = this.renderer
    const numParticles = this.numParticles
    const IMAGE_RATIO = video.width / video.height
    const COL_RATIO = IMAGE_RATIO > 1 ? IMAGE_RATIO : 1
    const ROW_RATIO = IMAGE_RATIO > 1 ? 1 : video.height / video.width

    let cols = COL_RATIO
    let rows = ROW_RATIO

    while (cols * rows < numParticles - (COL_RATIO * ROW_RATIO)) {
      cols += COL_RATIO
      rows += ROW_RATIO
    }

    const tWidth = Math.ceil(cols)
    const tHeight = Math.ceil(rows)
    this.numParticles = tWidth * tHeight

    this.FBO = new FBO({
      tWidth,
      tHeight,
      renderer: renderer.get(),
      uniforms: {
        tWidth: { type: 'f', value: tWidth },
        tHeight: { type: 'f', value: tHeight },
        mouse: { value: new THREE.Vector3(10000, 10000, 10000) },

        tSize: { type: 't', value: 0 },
        yThreshold: { type: 'f', value: this.yThreshold }
      },
      simulationVertexShader,
      simulationFragmentShader
    })

    this.FBO.setTextureUniform('tSize', this.getSizes())

    const videoImage = this.videoImage = document.createElement('canvas')
    this.videoImageContext = videoImage.getContext('2d')

    const videoTexture = this.videoTexture = new THREE.Texture(videoImage)
    videoTexture.minFilter = videoTexture.magFilter = THREE.NearestFilter
    videoTexture.needsUpdate = true

    const videoDiffImage = this.videoDiffImage = document.createElement('canvas')
    this.videoDiffImageContext = videoDiffImage.getContext('2d')
    videoDiffImage.height = 500
    videoDiffImage.width = 500

    const videoDiffTexture = this.videoDiffTexture = new THREE.Texture(videoDiffImage)
    videoDiffTexture.minFilter = videoDiffTexture.magFilter = THREE.NearestFilter
    videoDiffTexture.needsUpdate = true

    document.getElementsByTagName('body')[0].prepend(videoDiffImage)

    const material = this.material = new THREE.ShaderMaterial({
      blending: THREE.NormalBlending,
      uniforms: Object.assign({}, this.uniforms, {
        tTexture: { type: 't', value: videoTexture },
        tFrame: { type: 't', value: this.FBO.targets[0] }
      }),
      fragmentShader,
      vertexShader,
      opacity: 1,
      vertexColors: true,
      transparent: true
    })

    const geometry = this.geometry = new THREE.Geometry()

    for (let i = 0; i < this.numParticles; i++) {
      const vertex = new THREE.Vector3()
      vertex.x = (i % tWidth) / tWidth
      vertex.y = Math.floor(i / tWidth) / tHeight
      geometry.vertices.push(vertex)
    }

    this.particles = new THREE.Points(geometry, material)
    this.particles.frustumCulled = false

    this.scene.add(this.get())

    console.log('scene loaded!',
      `Expected: ${this.numParticles} particles`,
      `Actual: ${geometry.vertices.length} particles`,
      `Cols: ${tWidth}`,
      `Rows: ${tHeight}`)

    this.ready = true
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false)
  }

  getSizes () {
    const sizes = new Float32Array(this.numParticles * 4)
    for (let i = 0, i4 = 0; i < this.numParticles; i++, i4 += 4) {
      sizes[i4] = this.zInc * Math.random()
      sizes[i4 + 1] = this.yInc * (Math.random() / 2 + 0.5)
      sizes[i4 + 2] = this.calcSize()
      sizes[i4 + 3] = this.particleSizeInc * Math.random()
    }
    return sizes
  }

  calcSize () {
    const size = this.particleSize * Math.random()

    return size
  }

  update () {
    if (this.ready) {
      // update video texture with webcam feed
      const { video, videoImageContext, videoDiffImageContext, videoImage: { width: videoWidth, height: videoHeight }, videoTexture, videoDiffTexture } = this
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        videoImageContext.drawImage(video, 0, 0, videoWidth, videoHeight)

        videoTexture.needsUpdate = true

        const imgPixels = videoImageContext.getImageData(0, 0, videoWidth, videoHeight)

        for (let y = 0; y < imgPixels.height; y += 1) {
          for (let x = 0; x < imgPixels.width; x += 1) {
            const i = (y * 4) * imgPixels.width + x * 4

            imgPixels.data[i] -= imgPixels.data[i - 3]
            imgPixels.data[i + 1] -= imgPixels.data[i - 2]
            imgPixels.data[i + 2] -= imgPixels.data[i - 1]
          }
        }

        videoDiffImageContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height)

        videoDiffTexture.needsUpdate = true
      }

      this.FBO.simulate()
      this.material.uniforms.tFrame.value = this.FBO.getCurrentFrame()
    }
  }

  get () {
    return this.particles
  }
}
