/*globals module: false require: false __dirname: false process: false */
const webpack = require('webpack')
const path = require('path')
const webpackConfig = require('./webpack.config.js')
const webpackServer = require('./webpack.server.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const revision = require('child_process').execSync('git rev-parse HEAD').toString().trim()


function createConfig() {

  const config = Object.assign({}, webpackConfig)

  // ソースマップファイルをファイル出力
  config.devtool = 'source-map'
  // React Hot loaderは外す
  config.entry = {
    'bundle': [
      'babel-polyfill',
      path.join(__dirname, '/index'), // エントリポイントのjsxファイル
    ],
  }
  // 出力ファイル
  config.output = {
    path: `${__dirname}/dist`,
    filename: 'js-[hash:8]/[name].js',
    chunkFilename: 'js-[hash:8]/[name].js',
    publicPath: '/',
  }

  config.plugins = [
    // Scope Hoisting
    // スコープの巻き上げによる呼び出し回数の削減と圧縮
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 共通モジュールをまとめる
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'js-[hash:8]/vendor.js',
      minChunks: (module) => {
        return module.context && module.context.indexOf('node_modules') !== -1
      },
    }),
    // 環境変数をエクスポート
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'GIT_REVISION': JSON.stringify(revision),
      },
    }),
    // JSミニファイ
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      minimize: true,
      compress: {
        drop_debugger: true,
        drop_console: true,
        warnings: false,
      },
    }),
    // HTMLテンプレートに生成したJSを埋め込む
    new HtmlWebpackPlugin({
      filename: 'template.html', // renameしておく
      template: 'static/template.html',
    }),
  ]

  // staticフォルダのリソースをコピーする（CSS、画像ファイルなど）
  config.plugins.push(
    new CopyWebpackPlugin([{ from: 'static', ignore: 'template.html' }]),
  )

  return config
}

// SSR用webpackビルド設定追加
function createServerConfig() {
  const config = Object.assign({}, webpackServer)
  config.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ]
  return config
}

const configs = [
  createConfig(),
  createServerConfig(),
]


module.exports = configs
