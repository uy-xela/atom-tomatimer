'use babel'

import Timer from './timer'
import StatusBarTile from './status-bar-tile'
import StatsRecorder from './stats-recorder'
import { CompositeDisposable } from 'atom'

export default {
  subscriptions: null,

  activate (state) {
    // Set up timer
    this.timer = new Timer()
    this.timer.on('tick', () => this.tick())
    this.timer.on('one_minute_left', () => this.oneMinuteLeft())
    this.timer.on('break', () => this.break())

    // Restore or init a StatsRecorder
    if (state != null) this.statsRecorder = atom.deserializers.deserialize(state)
    if (this.statsRecorder == null) this.statsRecorder = new StatsRecorder()

    // Register commands
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'tomatimer:start': () => this.start(),
      'tomatimer:stop': () => this.stop(),
      'tomatimer:reset': () => this.reset()
    }))
  },

  deactivate () {
    this.subscriptions.dispose()

    if (this.statusBarTile != null) {
      this.statusBarTile.destroy()
      this.statusBarTile = null
    }
  },

  // TODO More achivements and stats
  serialize () {
    return this.statsRecorder.serialize()
  },

  /**
   * Consumed services
   */

  consumeStatusBar (statusBar) {
    this.statusBarTile = new StatusBarTile()
    this.statusBarTile.on('icon_click', () => this.showStats())
    this.statusBarTile.on('time_click', () => this.pauseOrResume())

    statusBar.addRightTile({
      item: this.statusBarTile.getElement(),
      priority: 999
    })
  },

  /**
   * Event handlers
   */

  start () {
    if (this.statusBarTile == null) setTimeout(() => this._start(), 1000)
    else this._start()
  },

  pauseOrResume () {
    if (this.paused) {
      this.timer.resume()
      this.paused = false
      this.notify('Tomatimer Resumed', 'Welcome back.')
    } else {
      this.timer.pause()
      this.paused = true
      this.notify('Tomatimer Paused', 'It must be important. Take your time.')
    }
    this.statusBarTile.togglePauseFlag(this.paused)
  },

  stop () {
    this.timer.stop()
    this.statusBarTile.render()
    this.notify('Bye!', 'See you next time.')
  },

  reset () {
    this.timer.stop()
    this.timer.start()
  },

  tick () {
    const seconds = this.timer.getSeconds()
    if (this.statusBarTile != null) this.statusBarTile.render(seconds)
  },

  /**
   * Remind user that only one minute left for work time
   */
  oneMinuteLeft () {
    this.notify('Wrap it up!', 'One last minute til break time.')
  },

  break () {
    // Update stats
    this.statsRecorder.addCompletion()

    // Interrupt
    atom.beep()
    atom.confirm({
      message: 'Take a break!',
      detailedMessage: 'We recommend 5 minutes.',
      buttons: {'Back to work': () => this.start()}
    })
  },

  /**
   * Show stats for today and history
   */
  showStats () {
    const today = `You have completed ${this.statsRecorder.today.completions} sessions today.`
    const history = `Historical: ${this.statsRecorder.history.completions}`
    this.notify('Tomatimer Stats', `${today} ( ${history} )`)
  },

  /**
   * Helpers
   */

  /**
   * Beep and show notification
   */
  notify (title, message) {
    atom.beep()
    atom.notifications.addInfo(title, {
      detail: message,
      icon: 'hourglass'
    })
  },

  _start () {
    if (this.timer.start()) this.notify('Go!', 'Have fun coding.')
  }
}
