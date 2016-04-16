'use strict'

const fileSystem = require('./memoryFs')

module.exports = function (file) {
  return new Promise(function(resolve, reject) {
    fileSystem.readFile(file, function(err, data) {
      if (err) { return reject(err) }

      resolve(data)
    })
  })
}
