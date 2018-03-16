const gulp = require('gulp')
const gutil = require('gulp-util')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('../webpack.config.js')
const dependencies = require('../package.json').dependencies

const { gitPortfolioOutput } = require('../config')

const devConfig = Object.create(webpackConfig)
const prodConfig = Object.create(webpackConfig)

gulp.task('build-js', (callback) => {
  prodConfig.devtool = 'source-map'
  prodConfig.entry.vendor = Object.keys(dependencies)

  prodConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    })
  )

  webpack(prodConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('build-prod', err)
    gutil.log('[build-prod]', stats.toString({
      colors: true
    }))

    if (process.env.NODE_ENV === 'production') {
      prodConfig.output.path = path.resolve(__dirname, '../../', gitPortfolioOutput, 'js')

      webpack(prodConfig, (err, stats) => {
        if (err) throw new gutil.PluginError('build-prod-git', err)
        gutil.log('[build-prod]', stats.toString({
          colors: true
        }))

        callback()
      })
    } else {
      callback()
    }
  })
})

gulp.task('watch-js', () => {
  devConfig.watch = true

  webpack(devConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('build-dev', err)
    gutil.log('[build-dev]', stats.toString({
      colors: true
    }))
  })
})
