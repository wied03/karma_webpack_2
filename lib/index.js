'use strict'

const path = require('path')
const fs = require('fs')

const preprocessor = require('./preprocessor')

function createPattern(path, included, watch) {
  return {pattern: path, included: included, served: true, watched: watch}
}

function cleanSourceMapFile(path) {
  // "zero" out
  fs.closeSync(fs.openSync(path, 'w'))
}

const initWebpack = function(logger, config, files) {
  const ourConfig = config.karmaWebpack = config.karmaWebpack || {}
  const log = logger.create('init.webpack')
  const webpackConfig = config.webpack
  const webpackOutput = webpackConfig.output = {
    path: process.cwd(),
    filename: 'bundle_karma.js'
  }
  const entryPoints = webpackConfig.entry.map(p => path.resolve(p))
  log.debug(`Loading webpack plugin from ${entryPoints}`)
  entryPoints.forEach(ep => {
    // will trigger the refresh from the webpack end
    files.push(createPattern(ep, true, false))
    config.preprocessors[ep] = ['webpack']
  })

  ourConfig.bundleFilename = path.resolve(webpackOutput.path, webpackOutput.filename)
  ourConfig.sourceMapFilename = ourConfig.bundleFilename + '.map'
  if (typeof webpackConfig.devtool !== 'undefined') {
    ourConfig.sourceMapsInWebpack = true
    // Karma will complain if this file doesn't exist but webpack might not have started yet
    cleanSourceMapFile(ourConfig.sourceMapFilename)
    // source maps should be served but not included since they aren't script
    files.push(createPattern(ourConfig.sourceMapFilename, false, false))
  }
}

initWebpack.$inject = ['logger', 'config' , 'config.files']

module.exports = {
  'framework:webpack': ['factory', initWebpack]
}

Object.assign(module.exports, preprocessor)
