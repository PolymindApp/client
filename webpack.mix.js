const mix = require('laravel-mix');
const path = require('path');
const webpack = require('webpack')
require('dotenv').config();

const dotenvPlugin = new webpack.DefinePlugin({
    'process.env': {
        API_URL: JSON.stringify(process.env.API_URL),
        FACEBOOK_URL: JSON.stringify(process.env.FACEBOOK_URL),
        TWITTER_URL: JSON.stringify(process.env.TWITTER_URL),
        YOUTUBE_URL: JSON.stringify(process.env.YOUTUBE_URL),
        GITHUB_URL: JSON.stringify(process.env.GITHUB_URL),
        TWITTER_TAG: JSON.stringify(process.env.TWITTER_TAG),
    },
})

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.ts('resources/app/main.ts', 'public/js/app.js')
    .vue()
    // .sass('resources/app/index.scss', 'public/css')
    .webpackConfig({
        devtool: 'source-map',
        plugins: [
            dotenvPlugin,
        ],
        devServer: {
            port: 8079,
        },
        resolve: {
            alias: {
                '@': path.resolve('resources/app')
            }
        }
    })

mix.options({
    hmrOptions: {
        host: 'localhost',
        port: '8079'
    },
});

mix.disableNotifications();
