const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

let htmlWebpack = {
	template: 'public/index.html'
};
if (process.env.CORDOVA === '1') {
	htmlWebpack['baseUrl'] = 'www/';
}

module.exports = {
	runtimeCompiler: true,
	publicPath: '/',
	lintOnSave: false,
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					VERSION: JSON.stringify(require('./package.json').version),
				}
			}),
			new HtmlWebpackPlugin(htmlWebpack),
		]
	},
	devServer: {
		disableHostCheck: true
	}
};
