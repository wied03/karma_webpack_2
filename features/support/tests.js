'use strict'

const Promise = require('bluebird')
const path = require('path')
const copy = Promise.promisify(require('fs-extra').copy)

module.exports = function () {
  this.Given(/^the '(.*)' tests$/, function (testDir) {
    const fullTestPath = path.join(__dirname, '../../test/integration', testDir)
    return copy(fullTestPath, this.testDir)
  })

  this.Given(/^the (\S+) Karma config file$/, function (config, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending')
  })

  this.When(/^I run the Karma test$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending')
  })

  this.Then(/^the test passes with JSON results:$/, function (expectedJson, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending')
  })
}
