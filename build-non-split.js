const rewire = require('rewire')
// eslint-disable-next-line import/no-extraneous-dependencies -- webpack comes from create-react-app
const webpack = require('webpack')

const defaults = rewire('react-scripts/scripts/build.js')
// eslint-disable-next-line no-underscore-dangle
const config = defaults.__get__('config')

// Consolidate chunk files instead
config.optimization.splitChunks = {
  cacheGroups: {
    default: false,
  },
}
// Move runtime into bundle instead of separate file
config.optimization.runtimeChunk = false

// JS
config.output.filename = 'static/js/[name].[hash].js'
// CSS. "5" is MiniCssPlugin
config.plugins[5].options.filename = 'static/css/[name].[hash].css'

// Manually dedupe bn.js@4.2.0 in the bundle
const bnJsReplaces = [
  'diffie-hellman',
  'asn1.js',
  'create-ecdh',
  'miller-rabin',
  'public-encrypt',
  'elliptic',
]

config.plugins.push(
  new webpack.NormalModuleReplacementPlugin(/^bn.js$/, (resource) => {
    if (
      bnJsReplaces.some((pkg) =>
        resource.context.includes(`node_modules/${pkg}`),
      )
    ) {
      // eslint-disable-next-line no-param-reassign -- Must reassign since api expects you to modify
      resource.request = 'diffie-hellman/node_modules/bn.js'
    }
  }),
)
