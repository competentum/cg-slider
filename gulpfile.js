'use strict';

var gulp = require('gulp');
var gutil = require("gulp-util");
var path = require('path');

var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require('./webpack.config.js');

var srcPath = path.resolve(__dirname, './src');
var buildPath = path.resolve(__dirname, '.');

gulp.task('webpack:build', function (callback) {
    var wpConfig = Object.create(webpackConfig);

    // run webpack
    webpack(wpConfig, function (err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack:build', err);
        }
        gutil.log('[webpack:build]', stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('webpack-dev-server', function () {
    var wpConfig = Object.create(webpackConfig);

    for (var key in wpConfig.entry) {

        if (wpConfig.entry.hasOwnProperty(key)) {
            var entry = wpConfig.entry[key];

            // if type of entry is string it should be changed by array
            if (typeof entry == 'string') {
                entry = [entry];
            }

            entry.unshift('webpack/hot/dev-server');
        }
    }

    wpConfig.devtool = 'eval';
    wpConfig.debug = true;
    wpConfig.plugins = wpConfig.plugins.concat(
        new webpack.HotModuleReplacementPlugin()
    );

    var compiler = webpack(wpConfig);

    var server = new WebpackDevServer(compiler, {
        contentBase: path.resolve(__dirname, './examples'),
        hot: true,
        watchOptions: {
            aggregateTimeout: 300
        },
        historyApiFallback: true
    });
    server.listen(9393, 'localhost', function (err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }
        gutil.log('[webpack-dev-server]',
            'http://localhost:9393/webpack-dev-server/index.html');
    });
});

gulp.task('watch', function () {
    gulp.watch([srcPath + '/**/*.js', srcPath + '/**/*.less'], ['webpack:build']);
});