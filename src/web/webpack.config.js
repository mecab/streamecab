/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const glob = require('fast-glob');
const bourbon = require('bourbon');
const neat = require('@samhammer/bourbon-neat');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const { VueLoaderPlugin } = require('vue-loader');

const htmls = glob.sync(`${__dirname}/public/**/*.html`);
const htmlWebpackPlugins = htmls.map(filepath =>
    new HtmlWebpackPlugin({
        filename: path.relative(path.join(__dirname, 'public'), filepath),
        template: filepath,
        inject: false,
    })
);

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        mode: isProduction ? 'production' : 'development',
        entry: {
            index: './assets/js/index.ts',
        },
        output: {
            path: __dirname + '../../../dist/web',
            publicPath: "/",
            filename: 'assets/js/[name].js'
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: 'vue-style-loader!css-loader!sass-loader'
                    }
                },
                {
                    test: /\.js?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                    query: {
                        presets: [['@babel/preset-env', {
                            targets: {
                                browsers: ['last 2 versions'],
                            },
                            useBuiltIns: 'usage'
                        }]],
                        plugins: [
                            ['babel-plugin-transform-builtin-extend', {
                                globals: ['Error']
                            }],
                            ['babel-plugin-transform-es2015-modules-commonjs']
                        ],
                    }
                },
                {
                    test: /\.ts?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer({ grid: true })
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer({ grid: true })
                                ]
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: bourbon.includePaths.concat(neat.includePaths),
                                resolve: {
                                    extensions: ['.scss']
                                },
                            }
                        }
                    ]
                },
                {
                    test: /\.(jpg|gif|png)$/,
                    loader: 'file-loader?name=assets/img/[name].[ext]'
                },
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'url-loader?name=assets/fonts/[name].[ext]&limit=10000&minetype=application/font-woff'
                },
                {
                    test: /\.(otf|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader?name=assets/fonts/[name].[ext]'
                },
                {
                    test: /\.(njk|nunjucks|html|tpl|tmpl)$/,
                    use: [
                        {
                            loader: 'nunjucks-isomorphic-loader',
                            query: {
                                root: [ path.resolve(__dirname, 'public') ]
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            ...htmlWebpackPlugins,
            new VueLoaderPlugin(),
            /*
            new CopyWebpackPlugin([
                { from: 'assets/favicon/', to: '.' },
                { from: 'assets/img/', to: 'assets/img' },
                { from: 'assets/fonts/', to: 'assets/fonts'}
            ]),
            */
        ],
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            },
            extensions: ['.js', '.ts', '.vue', '.css', '.scss']
        },
        optimization: {
            minimizer: [
                new UglifyJSPlugin({
                    parallel: true
                }),
                new OptimizeCssAssetsPlugin({
                    cssProcessor: cssnano,
                    cssProcessorPluginOptions: {
                        preset: ['default'],
                    },
                    canPrint: true
                })
            ]
        }
    };
};
