'use babel'

import {EventEmitter} from 'events'
import {formatSeconds} from './time-formatter'

export default class StatusBarTile extends EventEmitter {
  constructor () {
    super()
    this.render()
  }

  render (seconds) {
    if (this.element == null) {
      // Hourglass icon
      this.iconSpan = document.createElement('span')
      this.iconSpan.className = 'icon icon-hourglass'
      this.iconSpan.addEventListener('click', () => this.emit('icon_click'))

      // Time display
      this.timeSpan = document.createElement('span')
      this.timeSpan.addEventListener('click', () => this.emit('time_click'))

      // Pause flag
      this.pauseSpan = document.createElement('span')
      this.pauseSpan.textContent = 'P'
      this.pauseSpan.style.display = 'none'

      // Container
      this.element = document.createElement('div')
      this.element.className = 'inline-block tomatimer-tile'
      this.element.appendChild(this.iconSpan)
      this.element.appendChild(this.timeSpan)
      this.element.appendChild(this.pauseSpan)
    }

    // Set time
    this.timeSpan.textContent = formatSeconds(seconds)
  }

  togglePauseFlag (paused) {
    if (paused) this.pauseSpan.style.display = 'inline-block'
    else this.pauseSpan.style.display = 'none'
  }

  getElement () {
    return this.element
  }

  destroy () {
    this.element.remove()
  }
}
