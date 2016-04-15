'use strict'

const bluebird = require('bluebird')
const path = require('path')
const copy = bluebird.promisify(require('fs-extra').copy)
const exec = require('child_process').exec
const readFile = bluebird.promisify(require('fs').readFile)
const writeFile = bluebird.promisify(require('fs').writeFile)
const expect = require('chai').expect
const assert = require('chai').assert

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
    const cucumber = this
    exec('karma start --single-run --no-colors --log-level=debug', {
      cwd: this.karmaTmpDir
    }, function (err, stdout, stderr) {
      cucumber.karmaOutput = stdout
      cucumber.karmaError = stderr
      cucumber.karmaSuccess = !err
      return callback()
    })
  })

  function assertKarmaStatus(world, passFail) {
    const karmaMessaging = `stdout: ${world.karmaOutput}\nstderr:${world.karmaError}`
    if (passFail === 'passes') {
      assert(world.karmaSuccess, `Expected Karma to succeed, but it failed! ${karmaMessaging}`)
    }
    else {
      assert(!world.karmaSuccess, `Expected Karma to fail, but it succeeded! ${karmaMessaging}`)
    }
  }

  this.Then(/^the test (\S+)$/, function (passFail) {
    assertKarmaStatus(this, passFail)
  })

  this.Then(/^the test (\S+) with JSON results:$/, function (passFail, expectedJson) {
    assertKarmaStatus(this, passFail)
    const expectedClean = JSON.stringify(JSON.parse(expectedJson))
    const actualFilename = path.resolve(this.karmaTmpDir, 'test_run.json')

    return readFile(actualFilename).then(function(data) {
      const actualClean = JSON.stringify(JSON.parse(data.toString()))
      expect(actualClean).to.eq(expectedClean)
    })
  })

  this.Then(/^the Karma output contains '(.*)'$/, function (output) {
    expect(this.karmaOutput).to.include(output)
  })

  this.Then(/^the Karma output does not contain '(.*)'$/, function (output) {
    expect(this.karmaOutput).to.not.include(output)
  })

  this.Then(/^webpack logged informational messages$/, function () {
    expect(this.karmaOutput).to.include('chunk    {0} bundle_karma.js')
  })

  this.Given(/^an existing webpack bundle$/, function () {
    this.existingWebpackBundle = path.resolve(this.karmaTmpDir, 'bundle.js')
    return writeFile(this.existingWebpackBundle, 'foobar')
  })

  this.Then(/^the existing webpack bundle is left intact$/, function () {
    return readFile(this.existingWebpackBundle).then(function (data) {
      expect(data.toString()).to.eq('foobar')
    })
  })

  this.Then(/^webpack compilation errors are displayed$/, function () {
    expect(this.karmaOutput).to.match(/Module not found: Error: Cannot resolve 'file' or 'directory' \.\/missing_dependency in .*tmp\/test/)
  })
}
