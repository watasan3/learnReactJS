# React Hot Loaderによる自動リロード
ソースコード変更時のwebpackビルドを  
`webpack --watch`により行っていましたが  
React Hot Loaderの設定を行うことで  
ソースコード変更時にwebpackビルドしてくれる上にビルド完了後にブラウザを自動リロードしてくれます。  
パッケージにwebpack-dev-server、react-hot-loaderを追加します。  

```
$ yarn add --dev webpack-dev-server react-hot-loader
```

package.jsonにwebpack-dev-server起動用のスクリプトを追加します。

```
{
  "scripts": {
    "dev": "webpack-dev-server"
  },
}
```

webpack.config.jsにreact-hot-loaderの設定を追加します。  

```webpack.config.js
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
```

index.jsにReact Hot Loaderの設定を追加します。  
AppContainerコンポーネントで全体を囲います。  
webpack-dev-serverで起動時はmodule.hotで自動リロードの設定をAppに適応します。  

```index.js
import React  from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import client from 'axios'
import thunk from 'redux-thunk'
import { AppContainer } from 'react-hot-loader' // 追加

import App from './App'
import reducer from './reducer'

// axiosをthunkの追加引数に加える
const thunkWithClient = thunk.withExtraArgument(client)
// redux-thunkをミドルウェアに適用
const store = createStore(reducer, applyMiddleware(thunkWithClient))

const theme = createMuiTheme({})

// renderでWrapする
const render = Component => {
  ReactDOM.render(
    <AppContainer warnings={false}>
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Component />
        </Provider>
      </MuiThemeProvider>
    </AppContainer>,
    document.getElementById('root'),
  )
}

render(App)

// webpack-dev-server起動時はWebpack Hot Module Replacement APIでWrapする
if (module.hot) {
  module.hot.accept('./App', () => { render(App) })
}
```

次のコマンドでwebpack-dev-serverが8080ポートで起動できます。

```
$ yarn run dev
yarn run v1.3.2
$ webpack-dev-server
Project is running at http://localhost:8080/
webpack output is served from /
Content not from webpack is served from /Users/daikiterai/Desktop/learnReactJS
```

App.jsなどを編集して保存するとブラウザが更新されます。（ビルド＆部分リロード（HMR））