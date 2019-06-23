import DatGUI from 'dat-gui'

import { SHAPES } from '../objects/particles'

export default class Controls {
  constructor ({
    particles,
    scene
  } = {}) {
    this.gui = new DatGUI.GUI()

    this.addShapeControls(particles)
    this.addMouseRadiusControls(particles)
    this.addMousePushControls(particles)
    this.addYThresholdControls(particles)
    this.addSpeedControls(particles)
    this.addSizeControls(particles)
    this.addSizeIncControls(particles)
  }

  addShapeControls (particles) {
    this.gui.add(particles, 'particleShape', SHAPES)
      .onFinishChange(() => {
        particles.updateParticleVars()
      })
  }

  addYThresholdControls (particles) {
    this.gui.add(particles, 'yThreshold')
      .min(0)
      .max(1)
      .step(0.005)
      .onFinishChange(() => {
        particles.updateParticleVars()
      })
  }

  addMouseRadiusControls (particles) {
    this.gui.add(particles, 'mouseRadius')
      .min(0)
      .max(0.5)
      .step(0.005)
      .onFinishChange(() => {
        particles.updateParticleVars()
      })
  }

  addMousePushControls (particles) {
    this.gui.add(particles, 'mousePush')
      .min(0.00001)
      .max(0.001)
      .step(0.000005)
      .onFinishChange(() => {
        particles.updateParticleVars()
      })
  }

  addSpeedControls (particles) {
    this.gui.add(particles, 'xSpeed')
      .min(0.0000)
      .max(0.0005)
      .step(0.000001)
      .onFinishChange(() => {
        particles.updateParticleParams()
      })

    this.gui.add(particles, 'ySpeed')
      .min(0.0000)
      .max(0.0005)
      .step(0.000001)
      .onFinishChange(() => {
        particles.updateParticleParams()
      })
  }

  addSizeControls (particles) {
    this.gui.add(particles, 'particleSize')
      .min(0.01)
      .max(0.5)
      .step(0.005)
      .onFinishChange(() => {
        particles.updateParticleParams()
      })
  }

  addSizeIncControls (particles) {
    this.gui.add(particles, 'particleSizeInc')
      .min(0.00005)
      .max(0.0005)
      .step(0.00002)
      .onFinishChange(() => {
        particles.updateParticleParams()
      })
  }
}
