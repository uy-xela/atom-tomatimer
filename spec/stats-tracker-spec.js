'use babel'

import StatsTracker from '../lib/stats-tracker'
import {today} from '../lib/time-formatter'

describe('Stats tracker', function () {
  let tracker

  beforeEach(function () {
    tracker = new StatsTracker()
  })

  describe('StatsTracker::constructor', function () {
    it('should set default values', function () {
      expect(tracker.history).toEqual({completions: 0, linesAdded: 0, linesDeleted: 0})
      expect(tracker.today).toEqual({day: today(), completions: 0, linesAdded: 0, linesDeleted: 0})
      expect(tracker.session).toEqual({linesAdded: 0, linesDeleted: 0})
    })

    it('should inherits previous stats if provided', function () {
      const stats = {
        history: {completions: 2, linesAdded: 10, linesDeleted: 10},
        today: {day: today(), completions: 1, linesAdded: 5, linesDeleted: 5}
      }
      tracker = new StatsTracker(stats)
      expect(tracker.history).toEqual(stats.history)
      expect(tracker.today).toEqual(stats.today)

      // Ignore today's completions if 'today' has passed
      stats.today.day = '20140909'
      tracker = new StatsTracker(stats)
      expect(tracker.history).toEqual(stats.history)
      expect(tracker.today).toEqual({day: today(), completions: 0, linesAdded: 0, linesDeleted: 0})
    })
  })

  describe('StatsTracker::addCompletion', function () {
    it('should add to today and history', function () {
      tracker.addCompletion()
      expect(tracker.today.completions).toEqual(1)
      expect(tracker.history.completions).toEqual(1)
    })
  })

  describe('StatsTracker::addLines', function () {
    it('should add to session, today and history', function () {
      tracker.addLines(100)
      expect(tracker.session.linesAdded).toEqual(100)
      expect(tracker.today.linesAdded).toEqual(100)
      expect(tracker.history.linesAdded).toEqual(100)
    })
  })

  describe('StatsTracker::deleteLines', function () {
    it('should add to session, today and history', function () {
      tracker.deleteLines(100)
      expect(tracker.session.linesDeleted).toEqual(100)
      expect(tracker.today.linesDeleted).toEqual(100)
      expect(tracker.history.linesDeleted).toEqual(100)
    })
  })

  describe('StatsTracker::getStats', function () {
    it('should return stats', function () {
      expect(tracker.getStats()).toEqual({
        today: tracker.today,
        history: tracker.history,
        session: tracker.session
      })
    })
  })
})
