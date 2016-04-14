'use strict'

var dependency = require('./dependency')

describe('A suite', function() {
  it('contains spec with an expectation', function() {
    expect(dependency()).toBe('foobarr')
  })
})
