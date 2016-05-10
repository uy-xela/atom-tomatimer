'use babel'

import Timer from '../lib/timer'

describe('Timer', function () {
  let timer

  beforeEach(function () {
    timer = new Timer()
  })

  afterEach(function () {
    timer && timer.stop()
  })

  describe('Timer::start', function () {
    it('should start timer and return 1', function () {
      expect(timer.start()).toEqual(1)
      expect(timer.seconds).toBeTruthy()
      expect(timer.timer).toBeTruthy()
    })

    it('should ignore started timer and return 0', function () {
      timer.start()
      expect(timer.start()).toEqual(0)
    })
  })

  describe('Timer::stop', function () {
    it('should stop timer and set fields to null', function () {
      timer.start()
      timer.stop()
      expect(timer.timer).toBeNull()
      expect(timer.seconds).toBeNull()
    })
  })

  describe('Timer::pause', function () {
    it('should clear timer but keeps the seconds', function () {
      timer.start()
      timer.pause()
      expect(timer.timer).toBeNull()
      expect(timer.seconds).toBeTruthy()
    })
  })

  describe('Timer::resume', function () {
    it('should re-activate the timer', function () {
      timer.start()
      timer.pause()
      timer.resume()
      expect(timer.timer).toBeTruthy()
      expect(timer.seconds).toBeTruthy()
    })
  })

  describe('Timer::getSeconds', function () {
    it('should return seconds', function () {
      timer.seconds = 999
      expect(timer.getSeconds()).toEqual(999)
    })
  })

  describe('Timer::isStopped', function () {
    it('should return whether the timer is stopped', function () {
      expect(timer.isStopped()).toEqual(true)
      timer.start()
      expect(timer.isStopped()).toEqual(false)
      timer.stop()
      expect(timer.isStopped()).toEqual(true)
    })
  })
})
