'use strict'

const fs = require('fs')

module.exports = function (file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, function(err, data) {
      if (err) { return reject(err) }

      resolve(data)
    })
  })
}
