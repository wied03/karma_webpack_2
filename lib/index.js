'use strict'

const path = require('path')
const webpack = require('webpack')

const preprocessor = require('./preprocessor')
const getSourceMapProcessor = require('./sourceMapProcessor')
const normalizeEntryPoints = require('./normalizeEntryPoints')
const fileSystem = require('./memoryFs')

function createPattern(path, included, watch) {
  return {
    pattern: path,
    included: included,
    served: true,
    watched: watch
  }
}

function startWebpack(log, config, fileList) {
  const compiler = webpack(config)
    // webpack needs to know about the in memory FS
  compiler.outputFileSystem = fileSystem
  log.info('Begin webpack watch')
  var initialRunComplete = false
  return new Promise(function(resolve, reject) {
    compiler.watch({}, function(err, stats) {
      if (err) {
        return reject(err)
      }

      log.info(stats.toString())
      if (initialRunComplete) {
        log.info('webpack update, refreshing Karma')
        fileList.refresh()
      } else {
        initialRunComplete = true
        resolve()
      }
    })
  })
}

const initWebpack = function(logger, config, files, fileList) {
  const ourConfig = config.karmaWebpack = config.karmaWebpack || {}
  const log = logger.create('middleware:webpack')
  const webpackConfig = config.webpack
    // will be written in memory FS, so root is fine
  webpackConfig.output = {
    path: '/',
    filename: '[name].bundle.js'
  }

  const entryPoints = normalizeEntryPoints(webpackConfig)
  entryPoints.forEach((details, entryPoint) => {
    files.push(createPattern(entryPoint, true, false))
    // ensure we can hook in and replace each entry point with an output bundle
    config.preprocessors[entryPoint] = ['webpack']
  })
  log.debug('Loading webpack plugin')

  ourConfig.entryPointMapping = entryPoints
  if (typeof webpackConfig.devtool !== 'undefined') {
    ourConfig.sourceMapsInWebpack = true
  }
  ourConfig.webpackPromise = startWebpack(log, webpackConfig, fileList)
  return getSourceMapProcessor()
}

initWebpack.$inject = ['logger', 'config', 'config.files', 'fileList']

module.exports = {
  'middleware:webpack': ['factory', initWebpack]
}

Object.assign(module.exports, preprocessor)
