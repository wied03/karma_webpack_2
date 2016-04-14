'use strict'

const path = require('path')

const preprocessor = require('./preprocessor')

function createPattern(path, watch) {
    return {pattern: path, included: true, served: true, watched: watch};
};

const initWebpack = function(logger, config, files, preprocessors) {
  const log = logger.create('init.webpack')
  config.output = {
    path: process.cwd(),
    filename: 'bundle_karma.js'
  }
  const entryPoints = config.entry.map(p => path.resolve(p))
  log.debug(`Loading webpack plugin from ${entryPoints}`)
  entryPoints.forEach(ep => {
    files.push(createPattern(ep, false))
    preprocessors[ep] = ['webpack']
  })
}

initWebpack.$inject = ['logger', 'config.webpack' ,'config.files', 'config.preprocessors']

module.exports = {
  'framework:webpack': ['factory', initWebpack]
}

Object.assign(module.exports, preprocessor)
