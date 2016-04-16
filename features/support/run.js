'use strict'

const exec = require('child_process').exec
const spawn = require('child_process').spawn

module.exports = function () {
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

  this.Given(/^I run the Karma test and keep Karma running$/, function () {
    const world = this
    const karmaProcess = world.karmaProcess = spawn('karma', ['start', '--no-colors', '--log-level=debug'], {
      cwd: this.karmaTmpDir
    })
    world.karmaOutput = ''
    world.karmaError = ''
    karmaProcess.stdout.on('data', data => world.karmaOutput = world.karmaOutput + data.toString())
    karmaProcess.stderr.on('data', data => world.karmaError = world.karmaError + data.toString())
  })
}
