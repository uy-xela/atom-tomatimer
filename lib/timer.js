'use babel'

import {EventEmitter} from 'events'

const workSeconds = 25 * 60

export default class Timer extends EventEmitter {

  /**
   * Start timer
   * @return {number} Return 1 if started successfully, 0 if started already
   */
  start () {
    if (this.seconds == null) {
      this.seconds = workSeconds
      this.countDown()
      return 1
    }
    return 0
  }

  stop () {
    clearTimeout(this.timer)
    this.timer = this.seconds = null
  }

  countDown () {
    this.emit('tick')
    if (this.seconds === 60) this.emit('one_minute_left')
    if (this.seconds-- > 0) {
      this.timer = setTimeout(() => this.countDown(), 1000)
      return
    }

    // this.rounds++
    this.stop()
    setTimeout(() => this.emit('break'), 100)
  }

  getSeconds () {
    return this.seconds
  }

  // TODO
  serialize () {}
}
