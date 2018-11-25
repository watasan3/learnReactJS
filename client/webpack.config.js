/*globals module: false require: false __dirname: false */
const webpack = require('webpack')
const precss = require('precss')
const autoprefixer = require('autoprefixer')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const threadLoader = require('thread-loader')

const jsWorkerOptions = {
  workers: process.env.CIRCLE_NODE_TOTAL || require('os').cpus().length - 1,
  workerParallelJobs: 50,
  poolTimeout: 2000,
  poolParallelJobs: 50,
  name: 'js-pool-client',
}
threadLoader.warmup(jsWorkerOptions, [ 'babel-loader' ])


module.exports = {
  mode: 'development', // 開発モード
  devtool: 'cheap-module-source-map', // ソースマップファイル出力
  entry: [
    '@babel/polyfill', // babelのpolyfill設定
    'react-hot-loader/patch',
    path.join(__dirname, '/index'), // エントリポイントのjsxファイル
  ],
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.json'],
  },
  // React Hot Loader用のデバッグサーバ(webpack-dev-server)の設定
  devServer: {
    contentBase: path.join(__dirname, '/static'), // template.htmlの格納場所
    historyApiFallback: true, // history APIが404エラーを返す場合にtemplate.htmlに飛ばす
    inline: true, // ソース変更時リロードモード
    hot: true, // HMR(Hot Module Reload)モード
    port: 7070, // 起動ポート,
    publicPath: '/',
    proxy: {
      '**': {
        target: 'http://0.0.0.0:7000',
        secure: false,
        logLevel: 'debug',
        changeOrigin: true,
      },
    },
  },
  output: {
    publicPath: '/', // 公開パスの指定
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 出力ファイル名
      template: '../static/index.html', // template対象のtemplate.htmlのパス
    }),
    new webpack.HotModuleReplacementPlugin(), // HMR(Hot Module Reload)プラグイン利用
    // autoprefixerプラグイン利用、cssのベンダープレフィックスを自動的につける
    new webpack.LoaderOptionsPlugin({options: {
      postcss: [precss, autoprefixer({browsers: ['last 2 versions']})],
    }}),
  ],
  module: {
    rules: [{
      test: /\.js?$/, // 拡張子がjsで
      exclude: [/node_modules/, /dist/ ], // node_modules, distフォルダ配下は除外
      include: __dirname, // 直下のJSファイルが対象
      use: [
        { loader: 'cache-loader' },
        { loader: 'thread-loader', options: jsWorkerOptions },
        { loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['last 2 versions', '> 1%'],
                },
                modules: false,
                useBuiltIns: 'usage',
              }],
              '@babel/preset-react',
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { 'legacy': true }], // decorator用
              ['@babel/plugin-proposal-class-properties', { loose: true }], // クラスのdefaultProps、アローファンクション用
              '@babel/plugin-syntax-dynamic-import', // dynamic-import
              'react-hot-loader/babel', // react-hot-loader用
            ],
          },
        },
      ],
    }],
  },
}