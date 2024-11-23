import { resolve } from 'node:path'
import webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

/**
 * @returns {webpack.Configuration}
 */
export default function defineConfig(env) {
    return {
        mode: 'development',
        entry: {
            main: resolve(import.meta.dirname, 'web/main.js'),
        },
        output: {
            filename: '[name].[contenthash].js',
        },
        module: {
            rules: [
                {
                    resourceQuery: /raw/,
                    type: 'asset/source',
                },
                {
                    test: /\.vue$/,
                    use: ['vue-loader'],
                },
                {
                    test: /\.css$/,
                    use: [
                        'vue-style-loader',
                        'css-loader',
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        'vue-style-loader',
                        'css-loader',
                        'less-loader',
                    ]
                },
                {
                    resourceQuery: /^((?!raw).)*$/,
                    test: /\.jsx?$/i,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                            ],
                            plugins: [
                                '@emotion',
                                '@vue/babel-plugin-jsx',
                            ],
                        },
                    }],
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: resolve(import.meta.dirname, 'web/index.html'),
            }),
            new VueLoaderPlugin(),
        ],
        optimization: {
            minimizer: [
                new TerserPlugin({ extractComments: false, })
            ],
        },
        performance: {
            maxEntrypointSize: 1024 * 1024,
            maxAssetSize: 1024 * 1024,
        },
    }
}