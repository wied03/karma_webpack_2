'use strict'

module.exports = function () {
  this.Given(/^the '(.*)' tests$/, function (testDir, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending')
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
    callback(null, 'pending');
  });
}
