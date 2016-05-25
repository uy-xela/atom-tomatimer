'use babel'

import path from 'path'
import { CompositeDisposable } from 'atom'
import Timer from './timer'
import StatusBarTile from './status-bar-tile'
import StatsTracker from './stats-tracker'
import EditorObserver from './editor-observer'
import StatsView from './stats-view'

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

  activate () {
    // Load state from local storage
    this.loadState()

    // Set up timer
    this.timer = new Timer()
    this.timer.on('tick', () => this.tick())
    this.timer.on('one_minute_left', () => this.oneMinuteLeft())
    this.timer.on('break', () => this.break())

    // Register commands
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'tomatimer:start': () => this.start(),
      'tomatimer:stop': () => this.stop(),
      'tomatimer:reset': () => this.reset(),
      'tomatimer:pause-or-resume': () => this.pauseOrResume()
    }))

    // Init EditorObserver
    this.editorObserver = new EditorObserver()
    this.editorObserver.on('lines_added', lines => this.statsTracker.addLines(lines))
    this.editorObserver.on('lines_deleted', lines => this.statsTracker.deleteLines(lines))

    // Init stats view
    this.statsView = new StatsView()
    this.statsViewModal = atom.workspace.addModalPanel({item: this.statsView.getElement(), visible: false})
    this.statsView.on('close_clicked', () => this.statsViewModal.hide())
  },

  deactivate () {
    this.subscriptions.dispose()

    if (this.statusBarTile != null) {
      this.statusBarTile.destroy()
      this.statusBarTile = null
    }
  },

  /**
   * Load state from local storage
   */
  loadState () {
    const stateStr = window.localStorage.getItem('tomatimer') || {}
    try {
      const state = JSON.parse(stateStr)
      this.statsTracker = new StatsTracker(state.stats)
    } catch (err) {
      console.log(err)
      window.localStorage.removeItem('tomatimer')
      this.statsTracker = new StatsTracker()
    }
  },

  /**
   * Instead of using Atom's serializing mechanism that saves state separately for different projects,
   * use localStorage to share history data across projects and windows.
   * Atom manages the calls of this method, which is perfect for us.
   * TODO More achivements and stats
   */
  serialize () {
    const toSave = {
      stats: this.statsTracker.getStats()
    }

    window.localStorage.setItem('tomatimer', JSON.stringify(toSave))
  },

  /**
   * Consumed services
   */

  consumeStatusBar (statusBar) {
    this.statusBarTile = new StatusBarTile()
    this.statusBarTile.on('icon_click', () => this.toggleStats())
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

      // Resume once user starts typing again
      this.editorObserver.once('editor_did_change', () => {
        if (this.paused) this.pauseOrResume()
      })
    }
    this.statusBarTile.togglePauseFlag(this.paused)
  },

  // TODO cleanup
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
    const {linesAdded, linesDeleted} = this.statsTracker.getStats().today
    this.statsTracker.addCompletion(linesAdded, linesDeleted)

    // Interrupt
    this.beep()
    atom.confirm({
      message: 'Take a break!',
      detailedMessage: `${linesAdded} lines of code added and ${linesDeleted} lines deleted in the last session.`,
      buttons: {'Back to work': () => this.start()}
    })
  },

  /**
   * Toggle stats view modal
   */
  toggleStats () {
    if (this.statsViewModal.isVisible()) {
      this.statsViewModal.hide()
    } else {
      this.statsView.render(this.statsTracker.getStats())
      this.statsViewModal.show()
    }
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
    const todayCompletions = this.statsTracker.today.completions
    if (this.timer.start()) this.notify(`Round ${todayCompletions + 1} , Go`, 'Have fun coding.')

    this.editorObserver.start()
  },

  beep () {
    if (atom.config.get('tomatimer.beep')) {
      beepSound.currentTime = 0
      beepSound.play()
    }
  }
}
