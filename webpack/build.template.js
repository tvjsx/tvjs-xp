const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TerserPlugin = require('terser-webpack-plugin')

const webpack = require('webpack')
const path = require('path')

const VERS = require('../package.json').version
const DATE = new Date().toDateString()
const BANNER =

`[[NAME]] - v[[VERS]] - ${DATE}\n` +
`    Copyright (c) 2020 [[AUTHOR]]\n`
let common = {
    entry: {
        '[[NAME]]': './src/build/[[NAME]]/[[NAME]].js',
        '[[NAME]].min': './src/build/[[NAME]]/[[NAME]].js',
    },
    externals: {
        'trading-vue-js': 'trading-vue-js',
        'vue': 'vue'
    },
    output: {
        path: path.resolve(__dirname, '../../../dist/[[NAME]]'),
        filename: '[name].js',
        library: 'X[[NAMECAPS]]',
        libraryTarget: 'umd',
        //libraryExport: "default"
    },
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    module: {
        rules: [{
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            include: /\.min\.js$/,
            sourceMap: true,
            extractComments: {
                banner: BANNER
            }
        })]
    },
    devtool: '#source-map',
    plugins: [
        new VueLoaderPlugin(),
        new webpack.BannerPlugin({
            banner: BANNER
        })
    ]
}


module.exports = [
    common
]
