const mix = require('laravel-mix');
const path = require('path');

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
        host: 'bs-local.com',
        port: 8079,
    },
});

mix.disableNotifications();
