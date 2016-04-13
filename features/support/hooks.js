'use strict'

const fs = require('fs')
const rimraf = require('rimraf')

module.exports = function () {
  this.Before(function (scenario, callback) {
    const tmpDir = this.karmaTmpDir
    rimraf(tmpDir, function (err) {
      if (err) {
        return callback(err)
      }
      fs.mkdir(tmpDir, callback)
    })
  })
}
