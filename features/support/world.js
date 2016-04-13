'use strict'

const path = require('path')

function World() {
  this.karmaTmpDir = path.resolve(__dirname, '../../tmp')
  this.testDir = path.join(this.karmaTmpDir, 'test')
}

module.exports = function() {
  this.World = World
}
