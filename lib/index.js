'use strict'

const path = require('path')

const preprocessor = require('./preprocessor')

function createPattern(path, watch) {
    return {pattern: path, included: true, served: true, watched: watch};
};

const initWebpack = function(logger, config, files, preprocessors) {
  const log = logger.create('init.webpack')
  const entryPoint = path.resolve(config.entryPoint)
  log.debug(`Loading webpack plugin from ${entryPoint}`)
  files.push(createPattern(entryPoint, false))
  preprocessors[entryPoint] = ['webpack']
}

initWebpack.$inject = ['logger', 'config.webpack' ,'config.files', 'config.preprocessors']

module.exports = {
  'framework:webpack': ['factory', initWebpack]
}

Object.assign(module.exports, preprocessor)
