'use strict'

const path = require('path')

function World() {
  this.karmaTmpDir = path.resolve(__dirname, '../../tmp')
}

module.exports = function() {
  this.World = World
}
