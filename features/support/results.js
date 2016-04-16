'use strict'

const expect = require('chai').expect
const assert = require('chai').assert
const bluebird = require('bluebird')
const path = require('path')
const retry = require('retry')
const readFile = bluebird.promisify(require('fs').readFile)

module.exports = function () {
  function assertKarmaStatus(world, passFail) {
    const karmaMessaging = `stdout: ${world.karmaOutput}\nstderr:${world.karmaError}`
    if (passFail === 'passes') {
      assert(world.karmaSuccess, `Expected Karma to succeed, but it failed! ${karmaMessaging}`)
    }
    else {
      assert(!world.karmaSuccess, `Expected Karma to fail, but it succeeded! ${karmaMessaging}`)
    }
  }

  this.Then(/^the test (\S+)$/, function (passFail, callback) {
    if (this.karmaProcess) {
      const world = this
      const operation = retry.operation()

      operation.attempt(function(currentAttempt) {
        try {
          const passString = 'Executed 1 of 1 SUCCESS'
          const failString = 'Executed 1 of 1 FAIL'
          const doSee = passFail === 'passes' ? passString : failString
          expect(world.karmaOutput).to.include(doSee)
          const doNotSee = passFail === 'passes' ? failString : passString
          expect(world.karmaOutput).to.not.include(doNotSee)
          return callback()
        }
        catch (err) {
          if (operation.retry(err)) {
            return
          }

          callback(err)
        }
      })
    }
    else {
      assertKarmaStatus(this, passFail)
      callback()
    }
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
}
