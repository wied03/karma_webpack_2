'use strict'

const webpack = require('webpack')
const fs = require('fs')
const path = require('path')

// avoid another dependency
function webPackPromise(config) {
  return new Promise(function(resolve, reject) {
    webpack(config, function(err, stats) {
      if (err) { return reject(err) }

      resolve(stats)
    })
  })
}

function readFilePromise(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, function(err, data) {
      if (err) { return reject(err) }

      resolve(data)
    })
  })
}

function preProcessEntryFile(logger, karmaConfig, webpackConfig) {
  const log = logger.create('preprocessor.webpack')
  const bundleFilename = path.resolve(webpackConfig.output.path, webpackConfig.output.filename)
  const sourceMapFilename = bundleFilename + '.map'
  const sourceMapsEnabled = typeof webpackConfig.devtool !== 'undefined'

  var webpackLoaded = false

  return function(content, file, done) {
    log.debug(`received request for ${file}`)

    if (!webpackLoaded) {
      log.debug('loading webpack')
      webPackPromise(webpackConfig).then(function(stats) {
        log.info(stats.toString())
        webpackLoaded = true
        return sourceMapsEnabled ? readFilePromise(sourceMapFilename) : Promise.resolve(null)
      }).then(function(sourceMapData) {
        if (sourceMapData) {
          file.sourceMap = JSON.parse(sourceMapData.toString())
        }
        return readFilePromise(bundleFilename)
      }).then(function(bundleData) {
        done(bundleData.toString())
      })
    }
    else {
      throw 'we do not handle this yet'
    }
  }
}

preProcessEntryFile.$inject = ['logger', 'config', 'config.webpack']

module.exports = {
  'preprocessor:webpack': ['factory', preProcessEntryFile]
}
