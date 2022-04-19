const mix = require('laravel-mix');
const path = require('path');
const webpack = require('webpack')
require('dotenv').config();

const dotenvPlugin = new webpack.DefinePlugin({
    'process.env': {
        FACEBOOK_URL: JSON.stringify(process.env.FACEBOOK_URL),
        TWITTER_URL: JSON.stringify(process.env.TWITTER_URL),
        LINKEDIN_URL: JSON.stringify(process.env.LINKEDIN_URL),
        GITHUB_URL: JSON.stringify(process.env.GITHUB_URL),
        TWITTER_TAG: JSON.stringify(process.env.TWITTER_TAG),

        AMBIENCE1_TITLE: JSON.stringify(process.env.AMBIENCE1_TITLE),
        AMBIENCE1_URL: JSON.stringify(process.env.AMBIENCE1_URL),
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
        // devServer: {
        //     port: 8079,
        // },
        resolve: {
            alias: {
                '@': path.resolve('resources/app')
            }
        }
    })

// mix.options({
//     hmrOptions: {
//         host: 'bs-local.com',
//         port: 8079,
//     },
// });

mix.disableNotifications();
