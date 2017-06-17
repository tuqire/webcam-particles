import gulp from 'gulp';
import gutil from 'gulp-util';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

const devConfig = Object.create(require('../webpack.config.js'));
const port = '8084';

gulp.task('server', () => {
	devConfig.devtool = 'eval';
	devConfig.debug = true;
	devConfig.entry.app.unshift('webpack-dev-server/client?http://localhost:' + port, 'webpack/hot/dev-server');
	devConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

	new WebpackDevServer(webpack(devConfig), {
		publicPath: '/' + devConfig.output.publicPath,
		hot: true,
		inline: true,
		contentBase: 'dest/'
	}).listen(port, 'localhost', (err) => {
		if(err) throw new gutil.PluginError('server-dev', err);
		gutil.log('[server-dev]', 'http://localhost:' + port);
	});
});
