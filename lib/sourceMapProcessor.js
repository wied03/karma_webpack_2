'use strict'

const path = require('path')

const readFilePromise = require('./readFile')

module.exports = function(log) {
  return function(request, response, next) {
    if (request.url.endsWith('.map')) {
      // Might be several subdirectories in the URL, but we're running off 1 simple in memory filesystem
      const basename = path.basename(request.url)
      // relative to the source in our memory filesystem
      const webPackPath = path.join('/', basename)
      readFilePromise(webPackPath).then(sourceMapData => response.end(sourceMapData.toString())).catch(err => {
        log.error(`Expected to find source map file ${webPackPath} in memory filesystem! ${err}`)
        return next()
      })
    } else {
      return next()
    }
  }
}
