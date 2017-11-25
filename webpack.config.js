const config = require('config')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル追加 
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    __dirname + '/client/index', // エントリポイントのjsxファイル
  ],
  // importの相対パスを絶対パスで読み込みできるようにする
  resolve: {
    modules: ['client', 'node_modules'], // 対象のフォルダ
    extensions: ['.js', '.json'] // 対象のファイル
  },
  // React Hot Loader用のデバッグサーバ(webpack-dev-server)の設定
  devServer: {
    contentBase: __dirname + '/client/static', // index.htmlの格納場所
    historyApiFallback: true, // history APIが404エラーを返す時、index.htmlに遷移(ブラウザリロード時など)
    inline: true, // ソース変更時リロードモード
    hot: true, // HMR(Hot Module Reload)モード
    port: config.port + 1, // 起動ポート
    // CORSの対策（debugホストが違うため)
    proxy: {
      // CORSを許可するパスとサーバ
      '/api/**': {
        target: 'http://localhost:' + config.port,
        secure: false,
        changeOrigin: true
      }
    }
  },
  output: {
    publicPath: '/', // デフォルトルートにしないとHMRは有効にならない
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NamedModulesPlugin(), // 名前変更無効プラグイン利用
    new webpack.HotModuleReplacementPlugin() // HMR(Hot Module Reload)プラグイン利用 
  ],
  module: {
    rules: [{
      test: /\.js?$/, // 拡張子がjsで
      exclude: /node_modules/, // node_modulesフォルダ配下は除外
      include: __dirname + '/client',// client配下のJSファイルが対象
      use: {
        loader: 'babel-loader',
        options: {
          plugins: ["transform-react-jsx","babel-plugin-transform-decorators-legacy","react-hot-loader/babel"] // babelのtransform-react-jsxプラグインを使ってjsxを変換
        }
      }
    }]
  }
}

