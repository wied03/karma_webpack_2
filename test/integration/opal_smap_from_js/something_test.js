'use strict'

require('./dependency.rb')

// TODO: Use JS stacktrace here and assert it directly

describe('A suite', function() {
  it('contains spec with an expectation', function() {
    var result = Opal.Foobar.$howdy()
    expect(99).toBe(42)
  })
})
