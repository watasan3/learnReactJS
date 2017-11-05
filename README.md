# ReactRouterReduxで画面遷移状態をストア管理

React Router Reduxを使うと画面遷移状態をhistoryオブジェクトで管理することができます。 
下記コマンドでインストールします。 

```
$npm install --save-dev history react-router-redux@next
```

importのパスを相対パスから絶対パスで読込できるようにするため  
webpack.config.jsonにresolveの指定をします。（やっておいたほうが後々楽です）  

```webpack.config.js
  // importの相対パスを絶対パスで読み込みできるようにする
  resolve: {
    modules: ['client', 'node_modules'], // 対象のフォルダ
    extensions: ['.js', '.json'] // 対象のファイル
  },
```