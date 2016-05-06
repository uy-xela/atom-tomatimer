'use babel'

import {EventEmitter} from 'events'
import timeFormatter from './time-formatter'

export default class StatusBarTile extends EventEmitter {
  constructor () {
    super()
    this.render()
  }

  render (seconds) {
    if (this.element == null) {
      this.element = document.createElement('div')
      this.element.className = 'inline-block tomatimer-tile'
      this.iconSpan = document.createElement('span')
      this.iconSpan.className = 'icon icon-hourglass'
      this.timeSpan = document.createElement('span')
      this.element.appendChild(this.iconSpan)
      this.element.appendChild(this.timeSpan)
    }

    this.timeSpan.textContent = timeFormatter(seconds)
  }

  getElement () {
    return this.element
  }

  destroy () {
    this.element.remove()
  }
}
