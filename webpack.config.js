//Import node tools
const path = require('path');

//Import plugins
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

//Pathes

const PATH = {
    src: path.resolve(__dirname, "src"),
    dist: path.resolve(__dirname, "dist"),
    HTMLPage: path.resolve(__dirname, "src/index.html"),
    PostCSSConfig: path.resolve(__dirname, "configs/postcss.config.js"),
    favicon: path.resolve(__dirname, "src/favicon.ico"),
    icons: path.resolve(__dirname, "src/img/icons"),
    fonts: path.resolve(__dirname, "src/fonts")
}


//Mode configuration

const isDev = process.env.NODE_ENV === "development";

    //Configurate sourcemap mode
function setDevTool() {
    return isDev ? "source-map" : false;
}

    //Configurate CSS
function setCSS(cssCase) {
    let config = [
        MiniCssExtractPlugin.loader,
        {
            loader: "css-loader",
            options: {
                sourceMap: isDev,
            }
        },
    ]

    if(cssCase == "less") {
        config.push({
            loader: "less-loader",
            options: {
                sourceMap: isDev,
            }
        })
    }

    if(!isDev) {
        config.push({
            loader: "postcss-loader",
            options: {
                config: {
                    path: PATH.PostCSSConfig,
                }
            }
        })
    }

    return config;
}


module.exports = {
    entry: PATH.src,
    output: {
        filename: "[contenthash].js",
        path: PATH.dist,
    },
    devServer: {
        contentBase: PATH.dist,
        port: 4200,
    },
    devtool: setDevTool(),
    module: {
        rules: [
            {
                test: /\.js$/,
			    loader: 'babel-loader',
			    exclude: '/node_modules/',
            },
            {
                test: /\.css$/,
                use: setCSS(),
            },
            {
                test: /\.less$/,
                use: setCSS("less"),
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                exclude: /icons/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: "img/[name].[ext]"
                        }
                    },
                    // {
                    //     loader: "image-webpack-loader",
                    //     options: {
                    //         mozjpeg: {
                    //             progressive: false,
                    //             quality: 100,
                    //             dcScanOpt: 2,
                    //             enabiled: false
                    //         },
                    //         pngquant: {
                    //             quality: [0.9, 0.95],
                    //             speed: 1,
                    //         },
                    //         gifsicle: {
                    //             interlaced: false,
                    //         },
                    //         webp: {
                    //             quality: 75,
                    //         }
                    //     }
                    // }
                ],
            },
            {
                test: /\.svg$/,
                include: PATH.icons,
                use: [
                    {
                        loader: "svg-sprite-loader",
                    },
                    {
                        loader: "svgo-loader",
                    },
                ]
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: PATH.HTMLPage,
            filename: 'index.html'
        }),
        new CopyWebpackPlugin([
            {
                from: PATH.favicon,
                to: PATH.dist
            },
        ]),
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
    ]
}