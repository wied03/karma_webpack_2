'use strict'

const webpack = require('webpack')
const fs = require('fs')
const path = require('path')

function preProcessEntryFile(logger, karmaConfig, webpackConfig) {
  const log = logger.create('preprocessor.webpack')
  const bundleFilename = path.resolve(webpackConfig.output.path, webpackConfig.output.filename)

  var webpackLoaded = false

  return function(content, file, done) {
    log.debug(`received request for ${file}`)

    if (!webpackLoaded) {
      log.debug('loading webpack')
      webpack(webpackConfig, function (err, stats) {
        log.debug(`webpack loaded, reading bundle file ${bundleFilename}`)

        console.dir(stats.compilation.errors)
        webpackLoaded = true
        fs.readFile(bundleFilename, function (err, data) {
          if (err) {
            return done(err, null)
          }
          else {
            return done(data.toString())
          }
        })
      })
    }
  }
}

preProcessEntryFile.$inject = ['logger', 'config', 'config.webpack']

module.exports = {
  'preprocessor:webpack': ['factory', preProcessEntryFile]
}
