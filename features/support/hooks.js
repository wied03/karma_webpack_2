'use strict'

const Promise = require('bluebird')
const rimraf = Promise.promisify(require('rimraf'))
const mkdir = Promise.promisify(require('fs').mkdir)

module.exports = function () {
  this.Before(function () {
    const tmpDir = this.karmaTmpDir
    return rimraf(tmpDir).then(() => {
      return mkdir(tmpDir)
    })
  })
}
