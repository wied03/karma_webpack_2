# Karma WebPack 2

[![Build Status](http://img.shields.io/travis/wied03/karma_webpack_2/master.svg?style=flat)](http://travis-ci.org/wied03/karma_webpack_2)
[![Quality](http://img.shields.io/codeclimate/github/wied03/karma_webpack_2.svg?style=flat-square)](https://codeclimate.com/github/wied03/karma_webpack_2)
[![Version](https://img.shields.io/npm/v/karma_webpack_2.svg?style=flat-square)](https://www.npmjs.com/package/karma_webpack_2)

This is a fresh Karma webpack loader whose primary aim is to be test driven and simple
(currently still in development)

## Functionality:
* Webpack configuration specified within Karma config file
* Source map friendly (can be used automatically in results or made available to frameworks)
* Allows specifying other files to Karma outside of your webpack bundle
* Uses in memory filesytem for bundle location (but still allows filesystem caching for loaders like Babel, Opal)

## Installation:

```bash
npm install karma karma-webpack_2 --save-dev
```

## Configuration:

This is the simplest case:
```js
module.exports = function(config) {
  config.set({
    files: [],
    frameworks: ['jasmine'], // Jasmine not required, use whichever framework you want
    middleware: ['webpack'],
    webpack: {
      entry: ['./entry_point.js']
    }
    ...
  })
}
```

`webpack` is a webpack configuration hash. Here is an example using a different loader:
```js
module.exports = function(config) {
  config.set({
    files: [],
    frameworks: ['jasmine'], // Jasmine not required, use whichever framework you want
    middleware: ['webpack'],
    webpack: {
      entry: ['./entry_point.js'],
      module: {
        loaders: [
          {
            test: /\.rb$/,
            loader: 'opal-webpack'
          }
        ]
      }
    }
    ...
  })
}
```

If source maps are enabled in webpack, they will be served to Karma AND displayed in the results (if karma-sourcemap-loader is used). Given there is some overhead in loading source maps in the results, you may only wish to make them available in the browser/launcher you are using and not load them until requested. To do that, use a configuration like this:

```js
module.exports = function(config) {
  config.set({
    files: [],
    frameworks: ['jasmine'], // Jasmine not required, use whichever framework you want
    middleware: ['webpack'],
    webpack: {
      entry: ['./entry_point.js']
    },
    karmaWebpack: {
      sourceMapResults: false
    }
    ...
  })
}
```

## Limitations:
* Does not rely on [webpack dev middleware](https://github.com/webpack/webpack-dev-middleware) due to lack of tests for that project. It does however use the [memory-fs filesystem](https://github.com/webpack/memory-fs)
* Webpack config is not automatically read from `webpack.config.js` for you. You could do that manually in your Karma config for now.

Copyright (c) 2016, BSW Technology Consulting LLC
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
