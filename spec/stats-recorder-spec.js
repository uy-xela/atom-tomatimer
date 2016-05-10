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

  describe('StatsRecorder::serialize', function () {
    it('should serialize', function () {
      expect(recorder.serialize()).toEqual({
        deserializer: 'StatsRecorder',
        stats: {
          today: recorder.today,
          history: recorder.history
        }
      })
    })
  })

  describe('StatsRecorder.deserialize', function () {
    it('should return an instance of StatsRecorder', function () {
      const res = StatsRecorder.deserialize(recorder.serialize())
      expect(res instanceof StatsRecorder).toEqual(true)
    })

    it('should restore stats', function () {
      recorder.today.completions = 1
      recorder.history.completions = 2
      const res = StatsRecorder.deserialize(recorder.serialize())
      expect(res.today.completions).toEqual(1)
      expect(res.history.completions).toEqual(2)
    })
  })
})
