const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode:'development',
    entry: {
        main: './src/main.ts',
        index: './src/index.ts',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg)$/,
                use: ['file-loader'],
                exclude: /node_modules/
            }
        ],
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name]_bundle.js'
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/html/index.html',
            filename: 'index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: './src/html/main.html',
            filename: 'main.html',
            chunks: ['main']
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './src/data/*.txt',
                    to : './data/[name].txt'
                }
            ]           
        })
    ],
    devServer:{
        contentBase:`${__dirname}/dist`,
        inline:true,
        hot:true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:4000',
                changeOrigin: true,
                secure: false
            },
            '/socket.io' : {
                target: 'http://127.0.0.1:4000',
                ws: true,
                changeOrigin: true,
                secure: false
            }
        },
        host: '127.0.0.1',
        port: 4500
    },
    cache: {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.webpack_cache')
    },
};