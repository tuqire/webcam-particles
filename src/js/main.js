import isWebglEnabled from 'detector-webgl'

import { getParameterByName } from './helpers'

import Camera from './io/camera'
import GUI from './io/gui'
import Renderer from './io/renderer'
import Stats from './io/stats'

import Scene from './objects/scene'
import Particles from './objects/particles'

document.addEventListener('DOMContentLoaded', () => {
  if (isWebglEnabled) {
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
      numParticles: 100000,
      scene,
      renderer
    })

    const gui = new GUI({ particles }) // eslint-disable-line

    const init = () => {
      if (getParameterByName('stats') === 'true') {
        container.appendChild(stats.getDomElement())
      }
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
    const info = document.getElementById('info')
    info.innerHTML = 'Your browser is not supported. Please use the latest version of Firefox or Chrome.'
  }
})
