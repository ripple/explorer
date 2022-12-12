// eslint-disable-next-line import/no-extraneous-dependencies -- webpack comes from create-react-app
const webpack = require('webpack')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = function override(config, env) {
  config.plugins.push(
    new NodePolyfillPlugin({
      excludeAliases: ['console', 'crypto'],
    }),
  )
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  )
  // eslint-disable-next-line no-param-reassign -- not a param
  config.resolve.fallback = {
    module: false,
    dns: 'mock',
    fs: false,
    http2: false,
    net: false,
    tls: false,
    child_process: false,
    // Webpack no longer auto-polyfills for node core modules.
    // These are the polyfills for the necessary modules.
    assert: require.resolve('assert'),
    crypto: false, // require.resolve('crypto-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    console: require.resolve('console-browserify'),
    path: require.resolve('path-browserify'),
    url: 'url',
    util: 'util',
    zlib: 'browserify-zlib',
  }

  return config
}
