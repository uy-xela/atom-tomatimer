'use babel'

import path from 'path'
import {CompositeDisposable} from 'atom'
import Timer from './timer'
import StatusBarTile from './status-bar-tile'
import StatsRecorder from './stats-recorder'

/**
 * Fun titles for different number of completions in a day
 */
const statsTile = [
  'Noob',
  'First Blood',
  'Double Kill',
  'Killing Spree',
  'Dominating',
  'Mega Kill',
  'Unstoppable',
  'Wicked Sick',
  'Monnnnster Kill',
  'Godlike',
  'Holy shit'
]

/**
 * Notification sound
 */
const beepSound = new Audio(path.resolve(`${__dirname}/../assets/bell.mp3`))

export default {
  config: {
    sessionLength: {
      title: 'Session Length (In Minutes)',
      description: 'For each session, how much time do you want to work for before a break? (Change takes effect in next session.)',
      type: 'integer',
      default: 25,
      minimum: 5
    },
    beep: {
      title: 'Play Sound On Key Action',
      description: 'Play a sound on key actions like start, stop, pause, etc.',
      type: 'boolean',
      default: true
    }
  },

  subscriptions: null,

  activate (state) {
    // Set up timer
    this.timer = new Timer()
    this.timer.on('tick', () => this.tick())
    this.timer.on('one_minute_left', () => this.oneMinuteLeft())
    this.timer.on('break', () => this.break())

    // Restore or init a StatsRecorder
    if (state != null) this.statsRecorder = atom.deserializers.deserialize(state)
    this.statsRecorder = this.statsRecorder || new StatsRecorder()

    // Register commands
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'tomatimer:start': () => this.start(),
      'tomatimer:stop': () => this.stop(),
      'tomatimer:reset': () => this.reset(),
      'tomatimer:pause-or-resume': () => this.pauseOrResume()
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
    if (this.timer.isStopped()) return

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
    this.notify('Wrap It Up', 'One last minute til break time.')
  },

  break () {
    // Update stats
    this.statsRecorder.addCompletion()

    // Interrupt
    this.beep()
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
    const todayCompletions = this.statsRecorder.today.completions
    const today = `You have completed ${todayCompletions} sessions today.`
    const history = `Historical: ${this.statsRecorder.history.completions}`
    const titleNo = todayCompletions > statsTile.length ? statsTile.length : todayCompletions
    const title = statsTile[titleNo]

    this.notify(title, `${today} ( ${history} )`, true)
  },

  /**
   * Helpers
   */

  /**
   * Beep and show notification
   */
  /**
   * Play sound and show notification
   * @param  {string} title - Title of notification
   * @param  {string} message - Body of notification
   * @param  {boolean} silent - Whether sound should be muted, default to false
   */
  notify (title, message, silent = false) {
    if (!silent) this.beep()
    atom.notifications.addInfo(title, {
      detail: message,
      icon: 'hourglass'
    })
  },

  _start () {
    const todayCompletions = this.statsRecorder.today.completions
    if (this.timer.start()) this.notify(`Round ${todayCompletions} , Go`, 'Have fun coding.')
  },

  beep () {
    if (atom.config.get('tomatimer.beep')) {
      beepSound.currentTime = 0
      beepSound.play()
    }
  }
}
