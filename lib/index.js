'use strict'

const path = require('path')

function createPattern(path, watch) {
    return {pattern: path, included: true, served: true, watched: watch};
};

const initWebpack = function(logger, config, files, preprocessors) {
  const log = logger.create('init.webpack')
  const entryPoint = path.resolve(config.entryPoint)
  log.debug(`Loading webpack plugin from ${entryPoint}`)
  files.push(createPattern(entryPoint, false))
}

initWebpack.$inject = ['logger', 'config.webpack' ,'config.files', 'config.preprocessors']

module.exports = {
  'framework:webpack': ['factory', initWebpack]
}
