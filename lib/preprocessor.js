'use strict'

function preProcessEntryFile(logger) {
  const log = logger.create('preprocessor.webpack')

  return function(content, file, done) {
    log.debug(`received request for ${file}`)
    const placeholder = new Error('not implemented yet')
    return done(placeholder, null)
  }
}

preProcessEntryFile.$inject = ['logger']

module.exports = {
  'preprocessor:webpack': ['factory', preProcessEntryFile]
}
