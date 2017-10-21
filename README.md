# ミニマムなReactJS

ReactJSでDOMをレンダリングするには  

* ReactJS  
* React DOM  
* Babel

が必要です。  
簡易のため、上記JSファイルをCDN経由で読み込みます  

```index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://unpkg.com/react@15/dist/react.min.js"></script>
  <script src="https://unpkg.com/react-dom@15/dist/react-dom.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.38/browser.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ReactDOM.render(
      <h1>Hello, world!</h1>,
      document.getElementById('root')
    )
  </script>
</body>
</html>
```

実際にレンダリングしているのはReactDOM.renderの部分です。  
ここで注目すべき点はscriptタグ内なのに  
`<h1>`タグ（DOM）が記述されている点です。  
実際に実行される際にはBabelにて次のようなJSに変換されます。  
上記のような一見DOMが混じったようなJSの記法をJSXと呼びます。  
JSXはBebelによってJSのソースコードに変換(トランスパイル)されます。
実際にどのように変換されるか見てみましょう。  
  
ReactDOM.render部分のみのtest.jsxを作成します。  

```test.jsx
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
)
```

BabelとJSXトランスパイラをインストールします。  

```
# Babelコマンドをインストール
npm install -g babel-cli
# package.json作成
npm init --force
# BabelのJSXトランスパイラプラグインをダウンロード
npm install --save babel-plugin-transform-react-jsx
```

次のコマンドでtest.jsxに対して直接Babelのトランスパイルを行うとcompile.jsが出力されます。

```
$ babel --plugins transform-react-jsx test.jsx
ReactDOM.render(React.createElement(
  'h1',
  null,
  'Hello, world!'
), document.getElementById('root'));
```

実態はReactJSのReact.createElementメソッドにて動的にDOMが生成されていることがわかります。