'use strict'

const path = require('path')

const preprocessor = require('./preprocessor')
const getSourceMapProcessor = require('./sourceMapProcessor')

function createPattern(path, included, watch) {
  return {pattern: path, included: included, served: true, watched: watch}
}

const initWebpack = function(logger, config, files) {
  const ourConfig = config.karmaWebpack = config.karmaWebpack || {}
  const log = logger.create('middleware:webpack')
  const webpackConfig = config.webpack
  // will be written in memory
  const webpackOutput = webpackConfig.output = {
    path: process.cwd(),
    filename: 'bundle_karma.js'
  }
  const entryPoints = webpackConfig.entry.map(p => path.resolve(p))
  log.debug(`Loading webpack plugin, targeting ${entryPoints}`)
  entryPoints.forEach(ep => {
    // will trigger the refresh from the webpack end
    files.push(createPattern(ep, true, false))
    config.preprocessors[ep] = ['webpack']
  })

  ourConfig.bundleFilename = path.resolve(webpackOutput.path, webpackOutput.filename)
  ourConfig.sourceMapFilename = ourConfig.bundleFilename + '.map'
  if (typeof webpackConfig.devtool !== 'undefined') {
    ourConfig.sourceMapsInWebpack = true
  }

  return getSourceMapProcessor(ourConfig.sourceMapFilename)
}

initWebpack.$inject = ['logger', 'config' , 'config.files']

module.exports = {
  'middleware:webpack': ['factory', initWebpack]
}

Object.assign(module.exports, preprocessor)
