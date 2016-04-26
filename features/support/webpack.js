'use strict'

const expect = require('chai').expect
const bluebird = require('bluebird')
const path = require('path')
const readFile = bluebird.promisify(require('fs').readFile)
const writeFile = bluebird.promisify(require('fs').writeFile)

module.exports = function () {
  this.Then(/^webpack logged informational messages$/, function () {
    expect(this.karmaOutput).to.include('chunk    {0} main.bundle.js')
  })

  this.Given(/^an existing webpack bundle$/, function () {
    this.existingWebpackBundle = path.resolve(this.karmaTmpDir, 'bundle.js')
    return writeFile(this.existingWebpackBundle, 'foobar')
  })

  this.Then(/^the existing webpack bundle is left intact$/, function () {
    return readFile(this.existingWebpackBundle).then(function (data) {
      expect(data.toString()).to.eq('foobar')
    })
  })

  this.Then(/^webpack compilation errors are displayed$/, function () {
    expect(this.karmaOutput).to.match(/Module not found: Error: Cannot resolve 'file' or 'directory' \.\/missing_dependency in .*tmp\/test/)
  })
}
