# React Hot Loaderによる自動リロード
ソースコード変更時のwebpackビルドを  
`webpack --watch`により行っていましたが  
React Hot Loaderの設定を行うことで  
ソースコード変更時にwebpackビルドしてくれる上にビルド完了後にブラウザを自動リロードしてくれます。  
パッケージにwebpack-dev-server、react-hot-loaderを追加します。  

```
$ yarn add --dev webpack-dev-server react-hot-loader @babel/polyfill
```

package.jsonにwebpack-dev-server起動用のスクリプトを追加します。

```
{
  "scripts": {
    "dev": "webpack-dev-server --mode development"
  },
}
```

webpack.config.jsにwebpack-dev-serverとreact-hot-loaderの設定を追加します。  

```webpack.config.js
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development', // 開発モード
  devtool: 'cheap-module-source-map', // ソースマップファイル追加 
  name: 'bundle',
  entry: [
    '@babel/polyfill', // 古いブラウザへの互換性をもたせる
    'react-hot-loader/patch',
    __dirname + '/index', // エントリポイントのjsxファイル
  ],
  // React Hot Loader用のデバッグサーバ(webpack-dev-server)の設定
  devServer: {
    contentBase: __dirname, // index.htmlの格納場所
    inline: true, // ソース変更時リロードモード
    hot: true, // HMR(Hot Module Reload)モード
    port: 7070, // 起動ポート
  },
  output: {
    publicPath: '/dist', // distフォルダ以下を公開パスに指定
    filename: 'bundle.js',
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
          ['@babel/plugin-proposal-decorators', { 'legacy': true }], // decorator用
          ['@babel/plugin-proposal-class-properties', { loose: true }], // クラスのdefaultProps、アローファンクション用
          'react-hot-loader/babel', // react-hot-loader用
        },
      },
    }]
  }
}
```

App.jsにReact Hot Loaderの設定を追加します。  
hotモジュールでApp Componentを囲います。  

```App.js
import { hot } from 'react-hot-loader'

@hot(module)
export default class App extends React.Component {
  ...
} 
```

次のコマンドでwebpack-dev-serverが7070ポートで起動できます。

```
$ yarn dev
```

App.jsなどを編集して保存するとブラウザが更新されます。（ビルド＆部分リロード（HMR））
