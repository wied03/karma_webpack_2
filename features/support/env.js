'use strict'

module.exports = function () {
  // doing Karma + webpack runs, so grant more time
  this.setDefaultTimeout(20 * 1000)
}
