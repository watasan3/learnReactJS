# webpack + Babelでコンポーネントを作成する

webpackを使うことで複数のリソースファイルを１つにまとめることができます。  
さらにBabelと組み合わせることでJSXの変換に加えてブラウザではまだ未対応のimport文などが利用可能になります。  
これにより、JSファイルからJSファイルのモジュールを呼び出すような構成が可能になります。  
webpackでビルドするためにパッケージを追加します。  

```
$ npm install -D webpack babel-core babel-loader babel-plugin-transform-react-jsx babel-preset-react react react-dom react-hot-loader
```

package.jsonは次のようになります。

```package.json
{
  "name": "learnReactJS",
  "version": "1.0.0",
  "description": "ReactJSでDOMをレンダリングするには",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/teradonburi/learnReactJS.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/teradonburi/learnReactJS/issues"
  },
  "homepage": "https://github.com/teradonburi/learnReactJS#readme",
  "dependencies": {},
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-plugin-transform-react-jsx": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "react": "^16.0.0",
    "react-dom": "^16.0.0",
    "webpack": "^3.8.1"
  }
}
```

index.htmlを次のようにbundle.jsのみ読み込むように書き換えてください
（bundle.jsはwebpackでビルド後に生成されるファイル想定）
以降、index.htmlを書き換えることはほぼありません。

```index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  <div id="root"></div>
  <script type='text/javascript' src="bundle.js" ></script>
</body>
</html>
```

Reactのコンポーネントを作成します。(App.js)  
ReactのコンポーネントはReact.Componentを継承することで作成します。  
renderメソッドでDOMを返却するようにします。  
export defaultで外部のJSからクラスをimportできるようにします。  

```App.js
import React from 'react'

export default class App extends React.Component {

    render () {
        return <h1>Hello, world!</h1>
    }

}
```

index.jsにて作成したReactコンポーネントをimportしてDOMをレンダリングします。  
ここで注目してほしいのはJSXにて<App />というDOMが指定できるようになっています。  
React DOMによって作成したReactコンポーネントは新しいDOMとして指定できるようになります。  
（DOMの振る舞いはReactコンポーネント内部でJSで記述する）  
最終的なレンダリングはReactコンポーネントのrenderメソッドにて返却されるDOMが描画されます。  

```index.js
import React  from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
    <App />,
    document.getElementById('root')
)
```


```
module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル追加 
  entry: './index.js', // エントリポイントのjsxファイル
  output: {
    filename: 'bundle.js' // 出力するファイル
  },
  module: {
    loaders: [{
      test: /\.js?$/, // 拡張子がjsで
      exclude: /node_modules/, // node_modulesフォルダ配下は除外
      loader: 'babel-loader', // babel-loaderを使って変換する
      query: {
        plugins: ["transform-react-jsx"] // babelのtransform-react-jsxプラグインを使ってjsxを変換
      }
    }]
  }
}
```

次のコマンドでindex.jsに付随するJSファイルをまとめてビルドして一つのbundle.jsとして出力することができます

```webpack.config.js
$ node_modules/webpack/bin/webpack.js 
Hash: e39e8c0585972e41caa9
Version: webpack 3.8.1
Time: 3502ms
    Asset    Size  Chunks                    Chunk Names
bundle.js  835 kB       0  [emitted]  [big]  main
  [15] ./index.js 168 bytes {0} [built]
  [32] ./App.js 214 bytes {0} [built]
    + 31 hidden modules
```

index.htmlを開くと表示されるはずです。

# ReactJSのデバッグ

## ソースファイル変更を検知して再ビルド

下記のコマンドでwebpackの監視モードにするとビルド対象のJSファイルの変更が保存されるとビルドされるようになります。（開発中は楽です。）

```
$ webpack --watch
```

## コンポーネント単位のDOM把握

[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=ja)（ChromeのReact開発用ブラウザアドオン）
を導入すると  
Reactのコンポーネント単位でDOMツリーが把握できます。  

## ブレークポイントをかける
  
bableでトランスパイルするとJSファイルはすべて１つのbundle.jsにまとめられてしまいます。  
ソースマップと呼ばれるファイルをブラウザに読み込ませることで  
元のJSソースファイルの情報をブラウザに認識させることができます。  
（これにより元のJSファイル単位でブレークポイントをかけられる）  
webpackのソースマップファイルを有効にすることで元の各JSファイルを単位でブレークポイントをかけれます。

```webpack.config.js
module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル追加 
}
```

また、ソースファイル中にdebugger文を挿入することで指定箇所にブレークポイントをかけれます。  
（本番環境では処理が止まってしまうので挿入しないように注意）  

```
debugger;
```


もっと詳しく知りたい人はこちら：[Intro to debugging ReactJS applications](https://medium.com/@baphemot/intro-to-debugging-reactjs-applications-67cf7a50b3dd)