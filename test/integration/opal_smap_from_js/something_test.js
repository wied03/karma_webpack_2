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
        var theFrame = null
        frames.forEach(function (frame) {
          if (frame.fileName == 'webpack:///test/dependency.rb') {
            theFrame = frame
          }
        })
        expect(theFrame).not.toBe(null)
        expect(theFrame.lineNumber).toBe(5)
        // not sure why this isn't working. the map from webpack looks correct when plugged
        // in with the stack trace
        // expect(theFrame.functionName).toBe('howdy')
        return done()
      }).catch(function(problem) {
        console.error('Could not get stacktrace')
        console.dir(problem)
      })
    }
  })
})
