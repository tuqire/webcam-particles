import gulp from 'gulp';
import gutil from 'gulp-util';
import webpack from 'webpack';

const prodConfig = Object.create(require('../webpack.config.js'));

gulp.task('build-js', (callback) => {
	prodConfig.devtool = 'cheap-module-source-map';

	prodConfig.plugins.push(new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': JSON.stringify('production')
		}
	}));

	prodConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());

	webpack(prodConfig, function(err, stats) {
		if(err) throw new gutil.PluginError('build-prod', err);
		gutil.log('[build-prod]', stats.toString({
			colors: true
		}));

		callback();
	});
});