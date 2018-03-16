import TrackballControls from 'three-trackballcontrols'

export default class Controls {
  constructor ({
    camera,
    rendererDomElement = null,
    rotateSpeed = 1.0,
    zoomSpeed = 1.0,
    panSpeed = 1.0,
    noPan = false,
    staticMoving = true,
    dynamicDampingFactor = 0,
    minDistance = 0,
    maxDistance = Infinity,
    keys = [65, 83, 68]
  }) {
    this.controls = new TrackballControls(camera, rendererDomElement)

    this.controls.rotateSpeed = rotateSpeed
    this.controls.zoomSpeed = zoomSpeed
    this.controls.panSpeed = panSpeed
    this.controls.noPan = noPan

    this.controls.staticMoving = staticMoving
    this.controls.dynamicDampingFactor = dynamicDampingFactor

    this.controls.minDistance = minDistance
    this.controls.maxDistance = maxDistance

    this.controls.keys = keys
  }

  onChange (render) {
    this.controls.addEventListener('change', render)
  }

  update () {
    this.controls.update()
  }
}
