'use strict'

const expect = require('chai').expect
const webpack = require('webpack')

const proxyquire = require('proxyquire')
const tmpStub = {
  fileSync: function(options) {
    return {
      name: '/some_tmp/dir/tmp_bundle_file.js'
    }
  }
}
const pathStub = {
  resolve: function(something) {
    return `/absolute/${something}`
  }
}

const normalizeEntryPointsModule = proxyquire('../../lib/normalizeEntryPoints', {
  'tmp': tmpStub,
  'path': pathStub
})

function normalizeEntryPoints(config) {
  const rawResult = normalizeEntryPointsModule(config)
  const result = {}
  rawResult.forEach((value, key) => result[key] = value)
  return result
}

describe('normalizeEntryPoints', function() {
  context('single entry point string', function() {
    it('works', function() {
      const config = {
        entry: './entry_point.js'
      }

      const result = normalizeEntryPoints(config)

      expect(result).to.eql({
        '/absolute/./entry_point.js': {
          output: '/main.bundle.js',
          name: 'main',
          sourceMap: '/main.bundle.js.map'
        }
      })
    })
  })

  context('single entry point array', function() {
    it('works', function() {
      const config = {
        entry: ['./entry_point.js']
      }

      const result = normalizeEntryPoints(config)

      expect(result).to.eql({
        '/absolute/./entry_point.js': {
          output: '/main.bundle.js',
          name: 'main',
          sourceMap: '/main.bundle.js.map'
        }
      })
    })
  })

  context('multiple entry point array', function() {
    it('works', function() {
      const config = {
        entry: ['./entry_point.js', './entry_point2.js']
      }

      const result = normalizeEntryPoints(config)

      expect(result).to.eql({
        '/absolute/./entry_point.js': {
          output: '/entry_point.bundle.js',
          name: 'entry_point',
          sourceMap: '/entry_point.bundle.js.map'
        },
        '/absolute/./entry_point2.js': {
          output: '/entry_point2.bundle.js',
          name: 'entry_point2',
          sourceMap: '/entry_point2.bundle.js.map'
        }
      })
    })
  })

  context('multiple entry point object literal', function() {
    it('works', function() {
      const config = {
        entry: {
          a: './entry_point.js',
          b: './entry_point2.js'
        }
      }

      const result = normalizeEntryPoints(config)

      expect(result).to.eql({
        '/absolute/./entry_point.js': {
          output: '/a.bundle.js',
          name: 'a',
          sourceMap: '/a.bundle.js.map'
        },
        '/absolute/./entry_point2.js': {
          output: '/b.bundle.js',
          name: 'b',
          sourceMap: '/b.bundle.js.map'
        }
      })
    })
  })

  context('vendor entry point', function() {
    it('array case', function() {
      const config = {
        entry: {
          app: './entry_point.js',
          vendor22: ['foobar']
        },
        plugins: [
          new webpack.optimize.CommonsChunkPlugin( /* chunkName= */ "vendor22", /* filename= */ "vendor22.bundle.js")
        ]
      }

      const result = normalizeEntryPoints(config)

      expect(result).to.eql({
        '/some_tmp/dir/tmp_bundle_file.js': {
          output: '/vendor22.bundle.js',
          name: 'vendor22',
          sourceMap: '/vendor22.bundle.js.map'
        },
        '/absolute/./entry_point.js': {
          output: '/app.bundle.js',
          name: 'app',
          sourceMap: '/app.bundle.js.map'
        }
      })
      const realMap = normalizeEntryPointsModule(config)
        // vendor needs to come first in order
      expect(realMap.keys().next().value).to.eq('/some_tmp/dir/tmp_bundle_file.js')
    })

    it('string case', function() {
      const config = {
        entry: {
          app: './entry_point.js',
          vendor: 'foobar'
        },
        plugins: [
          new webpack.optimize.CommonsChunkPlugin( /* chunkName= */ "vendor", /* filename= */ "vendor.bundle.js")
        ]
      }

      const result = normalizeEntryPoints(config)

      expect(result).to.eql({
        '/some_tmp/dir/tmp_bundle_file.js': {
          output: '/vendor.bundle.js',
          name: 'vendor',
          sourceMap: '/vendor.bundle.js.map'
        },
        '/absolute/./entry_point.js': {
          output: '/app.bundle.js',
          name: 'app',
          sourceMap: '/app.bundle.js.map'
        }
      })
      const realMap = normalizeEntryPointsModule(config)
        // vendor needs to come first in order
      expect(realMap.keys().next().value).to.eq('/some_tmp/dir/tmp_bundle_file.js')
    })

    it('does not get confused by other plugins', function() {
      const config = {
        entry: {
          app: './entry_point.js'
        },
        plugins: [new webpack.optimize.DedupePlugin()]
      }

      const result = normalizeEntryPoints(config)

      expect(result).to.eql({
        '/absolute/./entry_point.js': {
          output: '/app.bundle.js',
          name: 'app',
          sourceMap: '/app.bundle.js.map'
        }
      })
    })
  })
})
