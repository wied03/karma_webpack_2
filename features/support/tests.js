'use strict'

const Promise = require('bluebird')
const path = require('path')
const copy = Promise.promisify(require('fs-extra').copy)

module.exports = function () {
  const integrationPath = path.join(__dirname, '../../test/integration')

  this.Given(/^the '(.*)' tests$/, function (testDir) {
    const fullTestPath = path.join(integrationPath, testDir)
    return copy(fullTestPath, this.testDir).then(() => {
      return copy(path.join(integrationPath, 'entry_point.js'), path.join(this.karmaTmpDir, 'entry_point.js'))
    })
  })

  this.Given(/^the (\S+) Karma config file$/, function (config) {
    const fullConfigPath = path.join(__dirname, '../../test/integration/karma_configs', config)
    return copy(fullConfigPath, path.join(this.karmaTmpDir, 'karma_config.js'))
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
