'use strict'

/*jshint expr: true*/

const expect = require('chai').expect
const proxyquire = require('proxyquire')

const readFileStub = function(filename) {
  return new Promise(function(resolve, reject) {
    if (filename === '/trigger.map') {
      reject(new Error('wrong file!'))
    }
    else if (filename === '/something.js.map') {
      resolve('foobar')
    }
    else {
      reject(new Error('Unexpected test case!'))
    }
  })
}

const sourceMapProcessor = proxyquire('../../lib/sourceMapProcessor', {
  './readFile': readFileStub
})

describe('sourceMapProcessor', function() {
  var loggedErrors = []
  beforeEach(function() {
    loggedErrors = []
  })

  function doProcess(request, response, next) {
    const log = {
      error: function(msg) {
        loggedErrors.push(msg)
      }
    }
    sourceMapProcessor(log)(request, response, next)
  }

  function doRequest(url, response, done) {
    const request = {
      url: url
    }
    const respWrapper = {
      end: function(data) {
        response(data)
      }
    }
    const next = function() {
      done(new Error('Did not expect this to be ignored but it was!'))
    }
    doProcess(request, respWrapper, next)
  }

  it('works with root cases', function(done) {
    doRequest('/base/something.js.map', function(data) {
      expect(data).to.eq('foobar')
      expect(loggedErrors).to.be.empty
      done()
    }, done)
  })

  it('works when a subdirectory is used in the URL from karma', function(done) {
    doRequest('/base/spec/dir/something.js.map', function(data) {
      expect(data).to.eq('foobar')
      expect(loggedErrors).to.be.empty
      done()
    }, done)
  })

  it('ignores non map requests', function(done) {
    const request = {
      url: '/something.else.js'
    }
    doProcess(request, null, done)
  })

  it('handles next an unexpected map request', function(done) {
    const request = {
      url: '/base/trigger.map'
    }
    doProcess(request, null, function() {
      expect(loggedErrors).to.eql(['Expected to find source map file /trigger.map in memory filesystem! Error: wrong file!'])
      done()
    })
  })
})
