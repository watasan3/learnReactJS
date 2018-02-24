/*globals module: false require: false __dirname: false */
const path = require('path')

module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル出力
  watch: true,  // 修正時に再ビルドする
  target: 'node', // NodeJS用ビルド
  entry: {
    ssr: [
      'babel-polyfill',
      path.join(__dirname, '/server/ssr.js'), // エントリポイントのjsxファイル
    ],
  },
  name: 'ssr', // [name]に入る名前
  output: {
    path: path.join(__dirname, '/server'), // serverフォルダに出力する
    filename: '[name].build.js', // 変換後のファイル名
    libraryTarget: 'commonjs2', // CommonJS形式で出力
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: __dirname, // 直下のJSファイルが対象
        exclude: [/node_modules/, /dist/ ], // node_modules, distフォルダ配下は除外
        use: {
          loader: 'babel-loader',
          query: {
            cacheDirectory: true, // キャッシュディレクトリを使用する
            presets: [
              [
                'env', {
                  targets: {
                    node: '8.6', // NodeJS バージョン8.6
                  },
                  modules: false,
                  useBuiltIns: true, // ビルトイン有効
                },
              ],
              'stage-0', // stage-0のプラグイン
              'react',
            ],
            plugins: [
              ['direct-import', [
                'material-ui', // material-ui
                'redux-form',  // redux-form
              ]],
              'babel-plugin-transform-decorators-legacy', // decorator用
            ],
          },
        },
      },
    ],
  },
}

