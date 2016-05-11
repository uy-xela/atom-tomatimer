'use babel'

import StatsRecorder from '../lib/stats-recorder'
import {today} from '../lib/time-formatter'

describe('Stats recorder', function () {
  let recorder

  beforeEach(function () {
    recorder = new StatsRecorder()
  })

  describe('StatsRecorder::constructor', function () {
    it('should set default values', function () {
      expect(recorder.history).toEqual({completions: 0})
      expect(recorder.today).toEqual({
        day: today(),
        completions: 0
      })
    })

    it('should inherits previous stats if provided', function () {
      const stats = {
        history: {completions: 2},
        today: {day: today(), completions: 1}
      }
      recorder = new StatsRecorder(stats)
      expect(recorder.history).toEqual(stats.history)
      expect(recorder.today).toEqual(stats.today)

      // Ignore today's completions if 'today' has passed
      stats.today.day = '20140909'
      recorder = new StatsRecorder(stats)
      expect(recorder.history).toEqual(stats.history)
      expect(recorder.today).toEqual({day: today(), completions: 0})
    })
  })

  describe('StatsRecorder::addCompletion', function () {
    it('should add to today', function () {
      recorder.addCompletion()
      expect(recorder.today.completions).toEqual(1)
    })

    it('should add to history', function () {
      recorder.addCompletion()
      expect(recorder.history.completions).toEqual(1)
    })
  })

  describe('StatsRecorder::getStats', function () {
    it('should return stats', function () {
      expect(recorder.getStats()).toEqual({
        today: recorder.today,
        history: recorder.history
      })
    })
  })
})
