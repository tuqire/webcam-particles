var webpack = require('webpack');
var path = require('path');

module.exports = {
	devtool: process.env.NODE_ENV === 'production' ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',
	entry: {
		app: ['./src/js/main.js']
	},
	output: {
		path: path.resolve(__dirname, 'dest', 'js'),
		publicPath: '/js/',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			THREE: 'three'
		})
	]
};