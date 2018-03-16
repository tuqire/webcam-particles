import StatsJS from 'stats.js'

export default class Stats {
  constructor () {
    this.stats = new StatsJS()
  }

  getDomElement (container) {
    return this.stats.domElement
  }

  update () {
    this.stats.update()
  }
}
