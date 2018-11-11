import isWebglEnabled from 'detector-webgl'
import Camera from './io/camera'
import Controls from './io/controls'
import Renderer from './io/renderer'
import Stats from './io/stats'
import Scene from './objects/scene'
import Particles from './objects/particles'

const isNotMobileScreen = () => window.matchMedia('(min-width: 480px)').matches
const isTabletScreen = () => window.matchMedia('(max-width: 1000px)').matches

document.addEventListener('DOMContentLoaded', () => {
  if (isWebglEnabled && isNotMobileScreen()) {
    const WIDTH = window.innerWidth
    const HEIGHT = window.innerHeight
    const aspectRatio = 1

    const container = document.getElementById('container')

    const renderer = new Renderer({
      width: WIDTH,
      height: HEIGHT,
      container
    })

    const scene = new Scene()

    const camera = new Camera({
      aspectRatio,
      position: {
        x: 0,
        y: 0,
        z: -1.25
      }
    })

    const stats = new Stats()

    const particles = new Particles({
      numParticles: isTabletScreen() ? 50000 : 100000,
      mousePush: 0.0002,
      scene,
      renderer
    })

    const init = () => {
      new Controls({ particles }) // eslint-disable-line
      container.appendChild(stats.getDomElement())
    }

    const animate = () => {
      requestAnimationFrame(animate) // eslint-disable-line
      render()
    }

    const render = () => {
      camera.update()
      stats.update()

      particles.update()

      renderer.render({
        scene: scene.get(),
        camera: camera.get()
      })
    }

    init()
    animate()
  } else {
    const error = document.getElementById('error')
    error.innerHTML = 'This browser is not supported. Please use the latest version of Chrome on desktop.'
  }
})
