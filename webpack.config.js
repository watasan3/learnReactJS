module.exports = {
  mode: 'development', // 開発モード
  devtool: 'inline-source-map', // ソースマップファイル追加 
  entry: './index.js', // エントリポイントのjsxファイル
  output: {
    filename: 'bundle.js' // 出力するファイル
  },
  module: {
    rules: [{
      test: /\.js?$/, // 拡張子がjsで
      exclude: /node_modules/, // node_modulesフォルダ配下は除外
      use: {
        loader: 'babel-loader', // babel-loaderを使って変換する
        options: {
          presets: ['env', 'react'],
          plugins: ['transform-class-properties', 'transform-decorators-legacy'],
        }
      }
    }]
  }
}