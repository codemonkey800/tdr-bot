const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/main.ts',
  externalsPresets: { node: true },

  externals: [
    nodeExternals({
      allowlist: ['lodash-es', '@tdr-bot/shared'],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.ts'],

    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },

  output: {
    filename: 'main.cjs',
    path: path.resolve(__dirname, 'dist'),
  },
}
