'use strict'

const webpack = require('webpack')

const readFilePromise = require('./readFile')

function preProcessEntryFile(logger, karmaConfig, webpackConfig, ourConfig, fileList) {
  const log = logger.create('preprocessor.webpack')
  const resultSourceMaps = ourConfig.sourceMapsInWebpack && (typeof ourConfig.sourceMapResults === 'undefined' || ourConfig.sourceMapResults)
  const compiler = webpack(webpackConfig)

  const doPreprocess = function(file, done) {
    var promise = resultSourceMaps ? readFilePromise(ourConfig.sourceMapFilename) : Promise.resolve(null)
    promise.then(function(sourceMapData) {
      if (sourceMapData) {
        file.sourceMap = JSON.parse(sourceMapData.toString())
      }
      return readFilePromise(ourConfig.bundleFilename)
    }).then(function(bundleData) {
      done(bundleData.toString())
    })
  }

  var initialRunComplete = false

  return function(content, file, done) {
    if (initialRunComplete) {
      // only end up here from a file refresh
      doPreprocess(file, done)
    }
    else {
      log.debug('loading webpack for first time')
      compiler.watch({}, function (err, stats) {
        if (err) { return done(err, null) }

        log.info(stats.toString())
        if (initialRunComplete) {
          log.debug('webpack update, refreshing Karma')
          fileList.refresh()
        }
        else {
          initialRunComplete = true
          // need our first run preprocessed
          doPreprocess(file, done)
        }
      })
    }
  }
}

preProcessEntryFile.$inject = ['logger', 'config', 'config.webpack', 'config.karmaWebpack', 'fileList']

module.exports = {
  'preprocessor:webpack': ['factory', preProcessEntryFile]
}
