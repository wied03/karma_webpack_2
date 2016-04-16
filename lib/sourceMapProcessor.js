'use strict'

const path = require('path')

const readFilePromise = require('./readFile')

module.exports = function(sourceMapFileName) {
  const baseName = path.basename(sourceMapFileName)

  return function (request, response, next) {
    if (request.url.endsWith(baseName)) {
      readFilePromise(sourceMapFileName).then(function(sourceMapData) {
        return response.end(sourceMapData.toString())
      })
    }
    else {
      return next()
    }
  }
}
