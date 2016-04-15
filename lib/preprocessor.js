'use strict'

const webpack = require('webpack')

const readFilePromise = require('./readFile')

// avoid another dependency
function webPackPromise(config) {
  return new Promise(function(resolve, reject) {
    webpack(config, function(err, stats) {
      if (err) { return reject(err) }

      resolve(stats)
    })
  })
}

function preProcessEntryFile(logger, karmaConfig, webpackConfig, ourConfig) {
  const log = logger.create('preprocessor.webpack')
  const resultSourceMaps = ourConfig.sourceMapsInWebpack && (typeof ourConfig.sourceMapResults === 'undefined' || ourConfig.sourceMapResults)

  var webpackLoaded = false

  return function(content, file, done) {
    log.debug(`received request for ${file}`)

    if (!webpackLoaded) {
      log.debug('loading webpack')
      webPackPromise(webpackConfig).then(function(stats) {
        log.info(stats.toString())
        webpackLoaded = true
        return resultSourceMaps ? readFilePromise(ourConfig.sourceMapFilename) : Promise.resolve(null)
      }).then(function(sourceMapData) {
        if (sourceMapData) {
          file.sourceMap = JSON.parse(sourceMapData.toString())
        }
        return readFilePromise(ourConfig.bundleFilename)
      }).then(function(bundleData) {
        done(bundleData.toString())
      })
    }
    else {
      throw 'we do not handle this yet'
    }
  }
}

preProcessEntryFile.$inject = ['logger', 'config', 'config.webpack', 'config.karmaWebpack']

module.exports = {
  'preprocessor:webpack': ['factory', preProcessEntryFile]
}
