'use babel'

import _ from 'lodash'
import { today } from './time-formatter'

export default class StatsTracker {
  constructor (stats) {
    // Default values
    this.history = {completions: 0, linesAdded: 0, linesDeleted: 0}
    this.today = {day: today(), completions: 0, linesAdded: 0, linesDeleted: 0}
    this.session = {linesAdded: 0, linesDeleted: 0}

    // Restore previous stats
    if (stats == null) return
    this.history = _.extend(this.history, stats.history)
    if (this.today.day === stats.today.day) this.today = _.extend(this.today, stats.today)
  }

  addCompletion () {
    const day = today()
    day === this.today.day
      ? this.today.completions++
      : this.today = {day: day, completions: 1, linesAdded: 0, linesDeleted: 0}

    this.history.completions++

    this.session = {linesAdded: 0, linesDeleted: 0}
  }

  addLines (lines) {
    this.session.linesAdded += lines
    this.today.linesAdded += lines
    this.history.linesAdded += lines
  }

  deleteLines (lines) {
    this.session.linesDeleted += lines
    this.today.linesDeleted += lines
    this.history.linesDeleted += lines
  }

  getStats () {
    return {history: this.history, today: this.today, session: this.session}
  }
}
