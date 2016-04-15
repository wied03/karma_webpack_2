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
        expect(theFrame.lineNumber).toBe(4)
        // does not work with Opal until 0.10
        // expect(theFrame.functionName).toBe('howdy')
        return done()
      }).catch(function(problem) {
        console.error('Could not get stacktrace')
        console.dir(problem)
      })
    }
  })
})
