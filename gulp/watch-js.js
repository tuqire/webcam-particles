import gulp from 'gulp';
import gutil from 'gulp-util';
import webpack from 'webpack';

const devConfig = Object.create(require('../webpack.config.js'));

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