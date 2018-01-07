const webpack = require('webpack')

module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル追加 
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    __dirname + '/index', // エントリポイントのjsxファイル
  ],
  // React Hot Loader用のデバッグサーバ(webpack-dev-server)の設定
  devServer: {
    contentBase: __dirname, // index.htmlの格納場所
    inline: true, // ソース変更時リロードモード
    hot: true, // HMR(Hot Module Reload)モード
    port: 8080, // 起動ポート
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
      include: __dirname,// client配下のJSファイルが対象
      use: {
        loader: 'babel-loader',
        options: {
          plugins: ['transform-react-jsx','transform-class-properties','babel-plugin-transform-decorators-legacy','react-hot-loader/babel'] 
        }
      }
    }]
  }
}

