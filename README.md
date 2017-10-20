# サーバ作成

NodeJSパッケージをインストール
[express](http://expressjs.com/ja/)というモジュールでサーバを作成します。
package.json作成

```
$ npm init --force
```

サーバ用のパッケージをインストール

```
$ npm install express --save
```

サーバソースコード

```server.js
// requireでサーバモジュールをインポート
const express = require('express')
const app = express()

// Getメソッド
app.get('/', (req, res) => {
  res.send('Get')
})

// Postメソッド
app.post('/', (req, res) => {
  res.json({'data':'Post'})
})

// サーバ待受け（3000ポート）
app.listen(3000, () => {
  console.log('Access to http://localhost:3000')
})
```

サーバ起動

```
$ node server.js
```

http://localhost:3000  
でサーバにGetアクセス  
  
Postのメソッドは[Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=ja)等のツールで確認

# DB