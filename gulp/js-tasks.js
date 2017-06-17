import gulp from 'gulp';
import gutil from 'gulp-util';
import webpack from 'webpack';
import webpackConfig from '../webpack.config.js';

import { src, dest, gitPortfolioOutput } from '../config';

const devConfig = Object.create(webpackConfig);

gulp.task('watch-js', () => {
	devConfig.devtool = 'eval';
	devConfig.debug = true;
	devConfig.progress = true;
	devConfig.colors = true;
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

	prodConfig.plugins.push(new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': JSON.stringify('production')
		}
	}));

	prodConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());

	webpack(prodConfig, (err, stats) => {
		if(err) throw new gutil.PluginError('build-prod', err);
		gutil.log('[build-prod]', stats.toString({
			colors: true
		}));

		prodConfig.output.path = `${gitPortfolioOutput}/js`;

		webpack(prodConfig, (err, stats) => {
			if(err) throw new gutil.PluginError('build-prod', err);
			gutil.log('[build-prod]', stats.toString({
				colors: true
			}));

			callback();
		});
	});
});
