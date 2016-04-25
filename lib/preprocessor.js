'use strict'

const readFilePromise = require('./readFile')

function preProcessEntryFile(logger, ourConfig) {
  const log = logger.create('preprocessor.webpack')
  const resultSourceMaps = ourConfig.sourceMapsInWebpack && (typeof ourConfig.sourceMapResults === 'undefined' || ourConfig.sourceMapResults)

  const doPreprocess = function(file, done) {
    const webpackOutputFile = ourConfig.entryPointMapping.get(file.toString())
    var promise = resultSourceMaps ? readFilePromise(webpackOutputFile + '.map') : Promise.resolve(null)
    promise.then(function(sourceMapData) {
      if (sourceMapData) {
        file.sourceMap = JSON.parse(sourceMapData.toString())
      }
      return readFilePromise(webpackOutputFile)
    }).then(function(bundleData) {
      done(bundleData.toString())
    })
  }

  return function(content, file, done) {
    // can't do anything until webpack has started up
    ourConfig.webpackPromise.then(() => {
      doPreprocess(file, done)
    }).catch(err => {
      console.log('got error '+err)
      done(err, null)
    })
  }
}

preProcessEntryFile.$inject = ['logger', 'config.karmaWebpack']

module.exports = {
  'preprocessor:webpack': ['factory', preProcessEntryFile]
}
