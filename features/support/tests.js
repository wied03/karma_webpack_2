'use strict'

const bluebird = require('bluebird')
const path = require('path')
const copy = bluebird.promisify(require('fs-extra').copy)
const exec = require('child_process').exec
const readFile = bluebird.promisify(require('fs').readFile)
const expect = require('chai').expect

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
    return copy(fullConfigPath, path.join(this.karmaTmpDir, 'karma.conf.js'))
  })

  this.When(/^I run the Karma test$/, function (callback) {
    const cucumber = this;
    exec('karma start --single-run --no-colors --log-level=debug', {
      cwd: this.karmaTmpDir
    }, function (err, stdout, stderr) {
      cucumber.karmaOutput = stdout;
      if (err) {
        console.log('Karma failed!')
        console.log(`Stdout: ${stdout}`)
        console.log(`Stdout: ${stderr}`)
        return callback(err)
      }
      return callback()
    })
  })

  this.Then(/^the test passes with JSON results:$/, function (expectedJson) {
    const expectedClean = JSON.stringify(JSON.parse(expectedJson))
    const actualFilename = path.resolve(this.karmaTmpDir, 'test_run.json')

    return readFile(actualFilename).then(function(data) {
      const actualClean = JSON.stringify(JSON.parse(data.toString()))
      expect(actualClean).to.eq(expectedClean)
    })
  })

  this.Then(/^webpack logged informational messages$/, function () {
    expect(this.karmaOutput).to.eq('foo')
  })
}
