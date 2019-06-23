import isWebglEnabled from 'detector-webgl'
import Camera from './io/camera'
import Controls from './io/controls'
import Renderer from './io/renderer'
import Stats from './io/stats'
import Scene from './objects/scene'
import Particles from './objects/particles'

import getParameterByName from './helpers/getParameterByName'
import showInfoBox from './helpers/showInfoBox'
import isNotMobileScreen from './helpers/isNotMobileScreen'

document.addEventListener('DOMContentLoaded', () => {
  const quality = Number(getParameterByName('quality'))

  if (!quality || isNaN(quality)) {
    document.getElementById('select-quality').style.display = 'block'
    return
  }

  if (isWebglEnabled && isNotMobileScreen()) {
    showInfoBox()

    const WIDTH = window.innerWidth
    const HEIGHT = window.innerHeight
    const aspectRatio = 1

    const container = document.getElementById('simulation')

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
      numParticles: quality,
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
    document.getElementById('no-support').style.display = 'block'
  }
})
