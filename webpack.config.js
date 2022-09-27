const dotenv = require('dotenv')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const path = require('path')

module.exports = (env, argv) => {
  dotenv.config({path: '.env'})

  const mode = argv.mode || 'development'
  const optimization = (mode == 'development' ? undefined : {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ],
  })
  const devtool = (mode == 'development' ? 'eval-source-map' : false)

  return {
    mode,
    optimization,
    devtool,
    entry: {
      app: __dirname + '/app.js',
      qtei: __dirname + '/lib.js'
    },
    output: {
      path: __dirname + '/public',
      filename: '[name].js',
      clean: true
    },
    devServer: {
      compress: true,
      port: 4000,
      hot: false,
      https: false,
      devMiddleware: {
        writeToDisk: true
      },
    },
    module: {
      rules: [
        {
          test: /\.riot$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              },
            },{
              loader: '@riotjs/webpack-loader',
              options: {
                // hot: true, // set it to true if you are using hmr
                // add here all the other @riotjs/compiler options riot.js.org/compiler
                // template: 'pug' for example
            }
          }]
        }, {
          test: /\.css$/i,
          use: [
            (mode == 'development' ? 'style-loader' : MiniCssExtractPlugin.loader),
            {
              loader: 'css-loader',
              options: {url: false}
            }
          ]
        }, {
          test: /\.s[ac]ss$/i,
          use: [
            (mode == 'development' ? 'style-loader' : MiniCssExtractPlugin.loader),
            {
              loader: 'css-loader',
              options: {url: false}
            },
            'sass-loader',
          ]
        }, {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({

      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
      new HtmlWebpackPlugin({
        template: 'index.ejs',
        filename: 'index.html',
        'hash': true,
        'chunks': ['standalone']
      }),
      new CopyWebpackPlugin({
        patterns: [
          {from: 'data/*'},
          {from: 'node_modules/@fortawesome/fontawesome-free/webfonts/*', to: 'webfonts/[name][ext]'},
          {from: 'node_modules/bootstrap-icons/font/fonts/*', to: 'fonts/[name][ext]'}
        ]
      })
    ]
  }
}
