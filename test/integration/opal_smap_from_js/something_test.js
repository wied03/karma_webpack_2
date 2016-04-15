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
        var theFrame = nill
        frames.forEach(function (frame) {
          // TODO: Not finding the frame
          // TODO: Manually check browser and ensure we're not including the source map
          if (frame.fileName == 'webpack:///test/dependency.rb') {
            theFrame = frame
          }
        })
        expect(theFrame).not.toBe(null)
        console.dir(theFrame)
        expect(theFrame.functionName).toBe('howdy2')
        expect(theFrame.lineNumber).toBe(4)
        return done()
      }).catch(function(problem) {
        console.error('Could not get stacktrace')
        console.dir(problem)
      })
    }
  })
})
