const dotenv = require('dotenv')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path')

module.exports = (env, argv) => {
  const mode = argv.mode || 'development'
  // if (mode == 'production') {
    // dotenv.config({path: '.env.production'})
  // }
  dotenv.config({path: '.env'})
  const useSsl = (process.env.USE_SSL == 'true')

  // console.log(mode, process.env.STATIC_URL)

  return {
    mode: mode,
    entry: {
      app: __dirname + '/app.js'
    },
    output: {
      path: __dirname + '/public',
      filename: '[name].js',
      clean: true
    },
    devtool: mode == 'development' ? 'eval-source-map' : false,
    devServer: {
      compress: true,
      port: 4000,
      hot: false,
      https: useSsl,
      headers: {
        'ACCESS-CONTROL-ALLOW-ORIGIN': 'https://dfk-paris.org'
      },
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
            'style-loader',
            {
              loader: 'css-loader',
              options: {url: false}
            }
          ]
        }, {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
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
