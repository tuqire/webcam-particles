const webpack = require('webpack')
const path = require('path')
const HandlebarsPlugin = require('handlebars-webpack-plugin')
const dependencies = require('./package.json').dependencies

const outputPath = process.env.GITHUB === 'true' ? path.resolve(__dirname, '..', 'tuqire.github', 'webcam-particles') : path.resolve(__dirname, 'dest')

const plugins = [
  new webpack.optimize.ModuleConcatenationPlugin(),

  new HandlebarsPlugin({
    entry: path.join(process.cwd(), 'src', 'hbs', 'index.hbs'),
    output: `${outputPath}/[name].html`
  }),

  new webpack.ProvidePlugin({
    THREE: 'three'
  })
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  )
}

module.exports = env => ({
  devtool: 'source-map',
  entry: {
    bundle: path.resolve(__dirname, 'src', 'js', 'main.js'),
    vendor: Object.keys(dependencies)
  },
  output: {
    filename: 'js/[name].js',
    path: outputPath
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  plugins,
  devServer: {
    contentBase: path.join(__dirname, 'dest'),
    port: 8085
  }
})
