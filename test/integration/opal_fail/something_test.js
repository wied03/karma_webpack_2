'use strict'

require('./dependency.rb')

describe('A suite', function() {
  it('contains spec with an expectation', function() {
    var result = Opal.Foobar.$howdy()
    expect(result).toBe(42)
  })
})
