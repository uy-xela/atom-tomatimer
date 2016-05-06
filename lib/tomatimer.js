'use babel'

import Timer from './timer'
import StatusBarTile from './status-bar-tile'
import { CompositeDisposable } from 'atom'

export default {
  subscriptions: null,
  modalView: null,
  modelPanel: null,
  timer: null,

  activate (state) {
    this.timer = new Timer()
    this.timer.on('tick', () => this.tick())
    this.timer.on('one_minute_left', () => this.oneMinuteLeft())
    this.timer.on('break', () => this.break())

    // this.tomatimerView = new TomatimerView(state.tomatimerViewState)

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register commands
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

  // TODO Achivements and stats
  serialize () {
    return {
      stats: this.timer.serialize()
    }
  },

  /**
   * Consumed services
   */

  consumeStatusBar (statusBar) {
    this.statusBarTile = new StatusBarTile()
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

  oneMinuteLeft () {
    this.notify('Wrap it up!', 'One last minute til break time.')
  },

  break () {
    atom.beep()
    atom.confirm({
      message: 'Take a break!',
      detailedMessage: 'We recommend 5 minutes.',
      buttons: {'Back to work': () => this.start()}
    })
  },

  /**
   * Helpers
   */

  notify (title, message) {
    atom.beep()
    atom.notifications.addInfo(title, {
      detail: message,
      icon: 'hourglass'
    })
  },

  _start () {
    if (this.timer.start()) this.notify('Go!', 'Coding is fun. Enjoy.')
  }
}
