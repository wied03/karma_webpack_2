'use strict'

const bluebird = require('bluebird')
const path = require('path')
const writeFile = bluebird.promisify(require('fs').writeFile)

module.exports = function () {
  this.When(/^I add a new spec file$/, function () {
    const newSpecFile = path.join(this.testDir, 'new_test.js')
    const specText = "describe('A suite', function() {\n" +
    "it('contains spec 2 with an expectation', function() {\n" +
    "expect(dependency()).toBe('foobar')\n" +
    '})\n' +
    '})'
    return writeFile(newSpecFile, specText)
  })
}
