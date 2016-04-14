'use strict'

const initWebpack = function(files, logger) {
  const log = logger.create('init.webpack')
  log.info('Loading webpack plugin')
}

initWebpack.$inject = ['config.files', 'logger']

module.exports = {
  'framework:webpack': ['factory', initWebpack]
}
