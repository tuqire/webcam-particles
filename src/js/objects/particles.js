import FBO from 'three.js-fbo'

import { simulationVertexShader, simulationFragmentShader } from '../shaders/simulationShaders'
import { vertexShader, fragmentShader } from '../shaders/shaders'

export const SHAPES = {
  CIRCLE: 'CIRCLE',
  SQUARE: 'SQUARE'
}

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

    mouseRadius = 0.05,
    mousePush = 0.0001,

    particleSize = 0.06,
    particleSizeInc = 0.0001,
    particleShape = SHAPES.CIRCLE,
    xSpeed = 0.00003,
    ySpeed = 0.00006,
    yThreshold = 0.2
  }) {
    this.scene = scene
    this.numParticles = numParticles
    this.renderer = renderer
    this.uniforms = uniforms

    this.mouseRadius = mouseRadius
    this.mousePush = mousePush
    this.particleSize = particleSize
    this.particleSizeInc = particleSizeInc
    this.particleShape = particleShape
    this.xSpeed = xSpeed
    this.ySpeed = ySpeed
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
        video.autoplay = true

        this.addParticles()
      }, err => console.error('video failed to load', err))
      : document.getElementsByTagName('body')[0].append(noSupport)
  }

  updateParticleVars () {
    this.FBO.simulationShader.uniforms.mouseRadius.value = this.mouseRadius
    this.FBO.simulationShader.uniforms.mousePush.value = this.mousePush
    this.FBO.simulationShader.uniforms.yThreshold.value = this.yThreshold
    this.material.uniforms.isCircle.value = this.particleShape === SHAPES.CIRCLE
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

        tParams: { type: 't', value: 0 },
        mouseRadius: { type: 'f', value: this.mouseRadius },
        mousePush: { type: 'f', value: this.mousePush },
        yThreshold: { type: 'f', value: this.yThreshold }
      },
      simulationVertexShader,
      simulationFragmentShader
    })

    this.updateParticleParams()

    const videoImage = this.videoImage = document.createElement('canvas')
    this.videoImageContext = videoImage.getContext('2d')

    const videoTexture = this.videoTexture = new THREE.Texture(videoImage)
    videoTexture.minFilter = videoTexture.magFilter = THREE.NearestFilter
    videoTexture.needsUpdate = true

    const material = this.material = new THREE.ShaderMaterial({
      blending: THREE.NormalBlending,
      uniforms: Object.assign({}, this.uniforms, {
        isCircle: { type: 'b', value: this.particleShape === SHAPES.CIRCLE },
        tVideo: { type: 't', value: videoTexture },
        tParams: { type: 't', value: this.FBO.targets[0] }
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

    this.ready = true
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false)
  }

  updateParticleParams () {
    const params = new Float32Array(this.numParticles * 4)

    for (let i = 0, i4 = 0; i < this.numParticles; i++, i4 += 4) {
      const speeds = this.getSpeeds()

      params[i4] = speeds.x
      params[i4 + 1] = speeds.y
      params[i4 + 2] = this.getSize()
      params[i4 + 3] = this.getSizeInc()
    }

    this.FBO.setTextureUniform('tParams', params)
  }

  getSpeeds () {
    return {
      x: this.xSpeed * Math.random(),
      y: this.ySpeed * (Math.random() / 2 + 0.5)
    }
  }

  getSize () {
    return this.particleSize * Math.random() / 2
  }

  getSizeInc () {
    return this.particleSizeInc * Math.random() * 2
  }

  update () {
    if (this.ready) {
      // update video texture with webcam feed
      const { video, videoImageContext, videoImage: { width: videoWidth, height: videoHeight }, videoTexture } = this
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        videoImageContext.drawImage(video, 0, 0, videoWidth, videoHeight)

        videoTexture.needsUpdate = true
      }

      this.FBO.simulate()
      this.material.uniforms.tParams.value = this.FBO.getCurrentFrame()
    }
  }

  get () {
    return this.particles
  }
}
