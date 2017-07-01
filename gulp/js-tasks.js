const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');

const { src, dest, gitPortfolioOutput } = require('../config');

const devConfig = Object.create(webpackConfig);

gulp.task('watch-js', () => {
	devConfig.watch = true;

	webpack(devConfig, (err, stats) => {
		if(err) throw new gutil.PluginError('build-dev', err);
		gutil.log('[build-dev]', stats.toString({
			colors: true
		}));
	});
});

const prodConfig = Object.create(webpackConfig);

gulp.task('build-js', (callback) => {
	prodConfig.devtool = 'cheap-module-source-map';
	prodConfig.entry.vendor = ['detector-webgl', 'stats.js', 'three', 'three-trackballcontrols'];

	prodConfig.plugins.push(
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			},
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true
		}),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    })
	);

	webpack(prodConfig, (err, stats) => {
		if(err) throw new gutil.PluginError('build-prod', err);
		gutil.log('[build-prod]', stats.toString({
			colors: true
		}));

		prodConfig.output.path = path.resolve(__dirname, gitPortfolioOutput, 'js');

		webpack(prodConfig, (err, stats) => {
			if(err) throw new gutil.PluginError('build-prod-git', err);
			gutil.log('[build-prod]', stats.toString({
				colors: true
			}));

			callback();
		});
	});
});
