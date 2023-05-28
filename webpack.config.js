const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const path = require('path')

function resolve(...parts) {
  return path.resolve(__dirname, ...parts)
}

const PROD = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: false,
  target: 'node',
  mode: PROD ? 'production' : 'development',
  entry: resolve('src/main.ts'),

  output: {
    filename: 'tdr-bot.js',
    path: resolve('dist'),
  },

  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],

    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts'],
    },

    plugins: [new TsconfigPathsPlugin()],
  },

  externalsPresets: { node: true },
  externals: [nodeExternals()],

  module: {
    rules: [
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader' },
    ],
  },
}
