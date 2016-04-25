'use strict'

const path = require('path')
const tmp = require('tmp')
const webpackCommonsPlugin = require('webpack').optimize.CommonsChunkPlugin

function getSingleEntry(entryPointFilename, singleton, entryName) {
  var name = entryName
  var output = null
  if (!name && singleton) {
    name = 'main'
  } else if (!name) {
    // avoid confusing multiple points
    name = path.basename(entryPointFilename)
    name = name.replace(path.extname(name), '')
  }
  output = output || `/${name}.bundle.js`
  return {
    output: output,
    sourceMap: output + '.map',
    name: name
  }
}

function getFromSimpleArray(entryArray) {
  var results = new Map()
  const single = entryArray.length == 1
  entryArray.forEach(e => {
    var result = getSingleEntry(e, single)
    results.set(path.resolve(e), result)
  })
  return results
}

function getFromObject(webpackConfig) {
  var results = new Map()
  const entryConfig = Object.assign({}, webpackConfig.entry)
  const commonsFilenames = getCommonsChunkFilenames(webpackConfig)
  for (var commonsEntry in commonsFilenames) {
    if (commonsFilenames.hasOwnProperty(commonsEntry)) {
        // Karma needs real files, even though we don't actually use them
      var vendorFilename = tmp.fileSync({
        postfix: `${commonsEntry}.chunk.js`,
        keep: false
      }).name

      var result = getSingleEntry(vendorFilename, false, commonsEntry)
      results.set(vendorFilename, result)
    }
  }
  // object literal case
  for (var entryName in entryConfig) {
    if (entryConfig.hasOwnProperty(entryName) && !commonsFilenames[entryName]) {
      var result = getSingleEntry(entryConfig[entryName], false, entryName)
      results.set(path.resolve(entryConfig[entryName]), result)
    }
  }
  return results
}

function getCommonsChunkFilenames(webpackConfig) {
  const result = {}
  const plugins = webpackConfig.plugins || []
  plugins.filter(plugin => webpackCommonsPlugin === plugin.constructor)
    .forEach(plugin => result[plugin.chunkNames] = plugin.filenameTemplate)
  return result
}

module.exports = function(webpackConfig) {
  const entryConfig = webpackConfig.entry
  var entryArray = null
  if (typeof entryConfig === 'string') {
    entryArray = [entryConfig]
  } else if (Array.isArray(entryConfig)) {
    entryArray = entryConfig
  }

  if (entryArray) {
    return getFromSimpleArray(entryArray)
  } else {
    return getFromObject(webpackConfig)
  }
}
