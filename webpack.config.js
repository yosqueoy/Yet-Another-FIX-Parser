const path = require('path');
const webpack = require('webpack');
const VERBOSE = process.argv.includes('--verbose');

module.exports = function (env) {
    const DEBUG = !(env && env.release);
    console.log("DEBUG: " + DEBUG);
    return {
        cache: DEBUG,
        stats: "verbose",
        entry: './src/app.js',
        output: {
            publicPath: '/',
            sourcePrefix: '  ',
            path: path.join(__dirname, 'build'),
            filename: 'app.bundle.js',
        },
        devtool: false,
        plugins: [
            new webpack.LoaderOptionsPlugin({
                debug: DEBUG
            }),
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': `"${process.env.NODE_ENV || (DEBUG ? 'development' : 'production')}"` }),
        ],
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        module: {
            rules: [
                { test: /\.jsx?$/, include: [path.resolve(__dirname, 'src')], loader: 'babel-loader' },
            ],
        }
    };
};
