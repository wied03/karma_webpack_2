'use strict'

const path = require('path')

const readFilePromise = require('./readFile')

module.exports = function() {
  return function(request, response, next) {
    if (request.url.endsWith('.map')) {
      // Karma prepends /base to stuff
      const relativePath = path.relative('/base', request.url)
      // relative to the source in our memory filesystem
      const webPackPath = path.join('/', relativePath)
      readFilePromise(webPackPath).then(function(sourceMapData) {
        return response.end(sourceMapData.toString())
      })
    } else {
      return next()
    }
  }
}
