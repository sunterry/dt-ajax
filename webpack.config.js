const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: path.join(__dirname, './index'),
	output: {
		filename: '[name].min.js',
		path: path.join(__dirname, './dist'),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: ['babel-loader'],
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin({
			cache: true,
			parallel: true
		})]
	},
};
