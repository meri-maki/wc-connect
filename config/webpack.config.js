/* eslint-disable no-undef */

const path = require("path")
const Webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const paths = require("./paths")
const packageJson = require("../package.json")

module.exports = function (buildMode) {
    const isProduction = buildMode === "production"

    const htmlFiles = [
        {
            template: "public/index.html",
            chunks: ["main"]
        },
    ]

    const plugins = [
        // ...
        ...htmlFiles.map((htmlFile) => {
            return new HtmlWebpackPlugin({
                filename: htmlFile.filename || path.basename(htmlFile.template),
                template: htmlFile.template,
                minify: isProduction
                    ? {
                          collapseWhitespace: true,
                          removeComments: true,
                          removeRedundantAttributes: true,
                          useShortDoctype: true
                      }
                    : false,
                chunks: htmlFile.chunks,
                inject: "body"
            })
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:8].css",
            chunkFilename: "css/[name].[contenthash:8].chunk.css",
            ignoreOrder: false
        }),
        new Webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"]
        }),
        /* new BundleAnalyzerPlugin(),
	].filter(Boolean) */
        !isProduction ? new BundleAnalyzerPlugin() : null
    ].filter(Boolean)
    // const isDevelopment = !isProduction

    return {
        mode: buildMode,
        entry: {
            main: "./src/main.js",
        },

        output: {
            filename: "js/[name].[contenthash:8].js",
            path: paths.appBuild,
            pathinfo: false,
            globalObject: "this",
            chunkLoadingGlobal: `myApp${packageJson.name}`
        },
        /* -------------------------------------------------------------------------- */
        /*                                     new                                    */
        /* -------------------------------------------------------------------------- */
        cache: {
            type: "filesystem"
        },

        optimization: {
            innerGraph: true,
            usedExports: true,
            moduleIds: "deterministic",
            mangleWasmImports: true,
            concatenateModules: true,
            // runtimeChunk: "single",
            /* -------------------------------------------------------------------------- */
            /*                                     new                                    */
            /* -------------------------------------------------------------------------- */
            minimize: isProduction,
            minimizer: [
                `...`, // default terser config
                new CssMinimizerPlugin(),
                new HtmlMinimizerPlugin()
            ],
            splitChunks: {
                chunks: "async",
                minSize: 20000,
                minRemainingSize: 0,
                minChunks: 4,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                enforceSizeThreshold: 50000,
                cacheGroups: {
                    default: {
                        minChunks: 4,
                        priority: -20,
                        reuseExistingChunk: true
                    },
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true
                    }
                }
            }
        },

        plugins,
        resolve: {
            extensions: [".js", ".jsx", ".json", ".svg", ".png"],
            fallback: {
                crypto: require.resolve("crypto-browserify"),
                stream: require.resolve("stream-browserify"),
                assert: require.resolve("assert"),
                http: require.resolve("stream-http"),
                https: require.resolve("https-browserify"),
                os: require.resolve("os-browserify"),
                url: require.resolve("url"),
                zlib: require.resolve("browserify-zlib"),
                path: require.resolve("path-browserify")
            }
        },
        module: {
            rules: [
                {
                    test: /\.(png|jpg|gif|webp|svg)$/i,
                    use: [
                        {
                            loader: "file-loader"
                        }
                    ]
                },
                {
                    test: /\.m?js/,
                    type: "javascript/auto",
                    resolve: {
                        fullySpecified: false
                    }
                },
                {
                    test: /\.(js)$/i,
                    include: paths.appSrc,
                    exclude: /\/node_modules\//,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    }
                },
                {
                    test: /\.json$/,
                    use: "json-loader"
                },
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components|package\.json)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                [
                                    "@babel/preset-react",
                                    {
                                        runtime: "automatic"
                                    }
                                ]
                            ],
                            plugins: [
                                [
                                    "module-resolver",
                                    {
                                        alias: {
                                            "~": "./src",
                                            "@": "./public/assets"
                                        }
                                    }
                                ]
                            ]
                        }
                    }
                },

                {
                    test: /\.module\.s(a|c)ss$/,
                    include: paths.appSrc,
                    exclude: /\/node_modules\//,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                                importLoaders: 2,
                                modules: {
                                    auto: true,
                                    localIdentName: "[local]_[hash:base64:5]"
                                }
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: true,
                                postcssOptions: {
                                    plugins: [["autoprefixer"]]
                                }
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [isProduction ? MiniCssExtractPlugin.loader : "style-loader", "css-loader"]
                },
                {
                    test: /\.s(a|c)ss$/,
                    include: paths.appSrc,
                    exclude: /\/node_modules\/|\.module\.s(a|c)ss$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                                importLoaders: 2
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: true,
                                postcssOptions: {
                                    plugins: [["autoprefixer"]]
                                }
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
            ]
        },
        devServer: {
            static: {
                directory: paths.appPublic
            },
            hot: true,
            compress: true,
            port: 3000
        },
        devtool: isProduction ? "source-map" : "inline-source-map"
    }
}
