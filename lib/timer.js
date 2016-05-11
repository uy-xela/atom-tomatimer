'use babel'

import {EventEmitter} from 'events'

export default class Timer extends EventEmitter {

  /**
   * Start timer
   * @return {number} Return 1 if started successfully, 0 if started already
   */
  start () {
    if (this.seconds == null) {
      const sessionLength = atom.config.get('tomatimer.sessionLength') || 25
      // this.seconds = 60 * sessionLength
      this.seconds = 10
      this.countDown()
      return 1
    }
    return 0
  }

  stop () {
    clearTimeout(this.timer)
    this.timer = this.seconds = null
  }

  pause () {
    if (this.isStopped()) return // Do nothing if stopped
    clearTimeout(this.timer)
    this.timer = null
  }

  resume () {
    this.countDown()
  }

  countDown () {
    this.emit('tick')
    if (this.seconds === 60) this.emit('one_minute_left')
    if (this.seconds-- > 0) {
      this.timer = setTimeout(() => this.countDown(), 1000)
      return
    }

    this.stop()
    setTimeout(() => this.emit('break'), 100)
  }

  getSeconds () {
    return this.seconds
  }

  isStopped () {
    return this.seconds == null
  }
}
