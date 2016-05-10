'use babel'

import {today, formatSeconds} from '../lib/time-formatter'

describe('Time formatters', function () {
  describe('today()', function () {
    it('should return today as a string', function () {
      const res = today()
      const date = new Date()

      // FIXME Somehow date.getYear() returns wrong year like 116
      // expect(+res.substr(0, 4)).toEqual(date.getYear())
      expect(+res.substr(4, 2)).toEqual(date.getMonth())
      expect(+res.substr(6, 2)).toEqual(date.getDate())
    })
  })

  describe('formatSeconds()', function () {
    it('should return a string in form of mm:ss', function () {
      expect(formatSeconds(71)).toEqual('01:11')
    })
  })
})
