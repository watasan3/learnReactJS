const webpack = require('webpack')
const precss = require('precss')
const autoprefixer = require('autoprefixer')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル追加 
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    path.join(__dirname, '/index'), // エントリポイントのjsxファイル
  ],
  // React Hot Loader用のデバッグサーバ(webpack-dev-server)の設定
  devServer: {
    contentBase: path.join(__dirname, '/static'), // index.htmlの格納場所
    historyApiFallback: true, // history APIが404エラーを返す場合にindex.htmlに飛ばす
    inline: true, // ソース変更時リロードモード
    hot: true, // HMR(Hot Module Reload)モード
    port: 8080, // 起動ポート,
  },
  output: {
    publicPath: '/', // デフォルトルートにしないとHMRは有効にならない
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 出力ファイル名
      template: 'static/index.html', // template対象のindex.htmlのパス
    }),
    new webpack.HotModuleReplacementPlugin(), // HMR(Hot Module Reload)プラグイン利用
    // autoprefixerプラグイン利用、cssのベンダープレフィックスを自動的につける 
    new webpack.LoaderOptionsPlugin({options: {
      postcss: [precss, autoprefixer({browsers: ['last 2 versions']})]
    }})
  ],
  module: {
    rules: [{
      test: /\.js?$/, // 拡張子がjsで
      exclude: [/node_modules/, /dist/ ], // node_modules, distフォルダ配下は除外
      include: __dirname, // 直下のJSファイルが対象
      use: {
        loader: 'babel-loader',
        options: {
          // babel build presets
          presets: [
            [
              'env', {
                targets: {
                  browsers: ['last 2 versions', '> 1%'] // ビルド最適化のブラウザターゲット
                },
                modules: false,
                useBuiltIns: true,  // ビルトイン有効
              }
            ],
            'stage-0', // stage-0のプラグイン
            'react', // reactのプラグインまとめ
          ],
          // babel トランスパイルプラグイン
          plugins: [
            'transform-class-properties', // classのプロパティ用
            'babel-plugin-transform-decorators-legacy', // decorator用
            'react-hot-loader/babel' // react-hot-loader用
          ] 
        }
      }
    }]
  }
}

