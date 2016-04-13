'use strict'

const bluebird = require('bluebird')
const rimraf = bluebird.promisify(require('rimraf'))
const mkdir = bluebird.promisify(require('fs').mkdir)

module.exports = function () {
  this.Before(function () {
    const tmpDir = this.karmaTmpDir
    return rimraf(tmpDir).then(() => {
      return mkdir(tmpDir)
    })
  })
}
