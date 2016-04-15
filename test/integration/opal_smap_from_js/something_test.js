'use strict'

require('./dependency.rb')
// PhantomJS
require('es6-promise').polyfill()
var StackTrace = require('stacktrace-js')

describe('A suite', function() {
  it('contains spec with an expectation', function(done) {
    try {
      Opal.Foobar.$howdy()
      // expected exception, didn't get one
      expect(true).toBe(false)
    }
    catch (e) {
      StackTrace.fromError(e).then(function(frames) {
        // TODO: We need to locate the correct frame and we need to add middleware to serve up
        // the map file on request
        frames.forEach(function (frame) {
          console.log('saw file '+frame.fileName)
        })
        var frame = frames[1]
        expect(frame.fileName).toBe('dependency.rb')
        expect(frame.functionName).toBe('howdy')
        expect(frame.lineNumber).toBe(4)
        return done()
      }).catch(function(problem) {
        console.log('could not get stacktrace')
        done(problem)
      })
    }
  })
})
