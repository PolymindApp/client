const mix = require('laravel-mix');
const path = require('path');
const fileHash = require('file-hash');
const webpack = require('webpack')
const WorkboxWebpack = require('workbox-webpack-plugin');
const ambiences = require('./.ambiences.json');
require('dotenv').config();

const plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            API_URL: JSON.stringify(process.env.API_URL),
            APP_URL: JSON.stringify(process.env.APP_URL),
            FACEBOOK_URL: JSON.stringify(process.env.FACEBOOK_URL),
            TWITTER_URL: JSON.stringify(process.env.TWITTER_URL),
            YOUTUBE_URL: JSON.stringify(process.env.YOUTUBE_URL),
            GITHUB_URL: JSON.stringify(process.env.GITHUB_URL),
            TWITTER_TAG: JSON.stringify(process.env.TWITTER_TAG),
        },
    })
];

if (process.env.NODE_ENV === 'production') {
    const additionalManifestEntries = ambiences.map(ambience => {
        const result = [];
        if (ambience.url && ambience.url.indexOf('http') === -1) { fileHash(hash => { result.push({ url: ambience.url, revision: hash }); }, path.resolve(__dirname + '/public' + ambience.url), 'sha1', true); }
        if (ambience.thumbnail && ambience.url.indexOf('http') === -1) { fileHash(hash => { result.push({ url: ambience.thumbnail, revision: hash }); }, path.resolve(__dirname + '/public' + ambience.url), 'sha1', true); }
        if (ambience.bg && ambience.url.indexOf('http') === -1) { fileHash(hash => { result.push({ url: ambience.bg, revision: hash }); }, path.resolve(__dirname + '/public' + ambience.url), 'sha1', true); }
        return result;
    }).flat();

    plugins.push(new WorkboxWebpack.InjectManifest({
        swSrc: './resources/app/service-worker.ts',
        swDest: './service-worker.js',
        mode: process.env.NODE_ENV === 'production' ? 'production' : null,
        maximumFileSizeToCacheInBytes: 1024 * 1024 * 32, // 32MB
        modifyURLPrefix: {
            '//': '/'
        },
        additionalManifestEntries,
    }));
}

mix.ts('resources/app/main.ts', 'public/js/app.js')
    .vue()
    .webpackConfig({
        devtool: 'source-map',
        module: {
            rules: [{
                test: /\.wav$/,
                loader: 'file-loader'
            }]
        },
        plugins,
        devServer: {
            host: '0.0.0.0',
            port: 8079,
        },
        resolve: {
            alias: {
                '@': path.resolve('resources/app')
            }
        }
    })
    .options({
        hmrOptions: {
            host: 'localhost',
            port: 8079
        },
    })
    .disableNotifications();
