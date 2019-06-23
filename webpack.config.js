const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const outputPath = process.env.GITHUB === 'true' ? path.resolve(__dirname, '..', 'tuqire.github.io', 'webcam-particles') : path.resolve(__dirname, 'dest')

const plugins = [
  new webpack.optimize.ModuleConcatenationPlugin(),

  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'src', 'html', 'index.html'),
    minify: isProduction && {
      html5: true,
      collapseWhitespace: true,
      caseSensitive: true,
      removeComments: true
    }
  }),

  new CopyWebpackPlugin([
    { from: 'src/images', to: 'images' }
  ]),

  new webpack.ProvidePlugin({
    THREE: 'three'
  }),

  new CleanWebpackPlugin()
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  )

  plugins.push(
    new webpack.HashedModuleIdsPlugin()
  )
}

module.exports = env => ({
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'none' : 'eval-source-map',
  entry: {
    main: path.resolve(__dirname, 'src', 'js', 'main.js')
  },
  output: {
    filename: 'js/[name].[hash].js',
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
  optimization: {
    runtimeChunk: 'single',
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: !isProduction
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
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
