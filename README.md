# サーバ作成

NodeJSパッケージをインストール  
[express](http://expressjs.com/ja/)というモジュールでサーバを作成します。  
パッケージ管理用のpackage.jsonファイルを作成します。

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


# デバックツールの導入
node-dev:サーバソースコードを変更検出時に再起動してくれる（開発モード）

```
$ npm install -g node-dev
```

下記コマンドでデバッグ＆開発モード起動が可能

```
$ node-dev --inspect server.js
```

[NIM (Node Inspector Manager)](https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj/related)
をChromeアドオンを追加  
デバック起動しているサーバのソースコードにブレークポイントを貼れる

# DB

DBを使うことでデータを永続的に保存できます。  
今回は簡易的に[NeDB](https://github.com/louischatriot/nedb)というJSONファイル保存形式のDBでデータを永続化します。  
下記モジュールを追加でインストール  

```
$ npm install --save nedb
$ npm install --save body-parser
```

NeDBを使ったサーバプログラムです。

```serverWithDB.js
// requireでサーバモジュールをインポート
const express = require('express')
const app = express()
// DB
const Datastore = require('nedb')
const db = new Datastore({ filename: 'user.db', autoload: true })

// 例外ハンドリング
process.on('uncaughtException', (err) => console.log('uncaughtException => ' + err))

// Postのbodyパラメータ取得
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Getメソッド
app.get('/user/:name', (req, res) => {
  get({name:req.params.name})
  .then( data => res.json(data))
  .catch( e => res.json({'error':e.toString()}))
})

// Postメソッド
app.post('/user', (req, res) => {
  post(req.body)
  .then( data => res.json(data))
  .catch( e => res.json({'error':e.toString()}))
})

function find (param) {
  return new Promise((resolve,reject) => {
    db.find(param,(err,docs)=>{
      if (err) {
        reject(err)
      } else {
        resolve(docs)
      }
    })    
  })
}

function insert (param) {
  return new Promise((resolve,reject) => {
    db.insert(param,(err, newDoc) => {
      if (err) {
        throw err
      } else {
        resolve(newDoc)
      }  
    })
  })  
}

async function get (param) {
  return await find(param)
}

async function post (param) {
  return await insert(param)
}

// サーバ待受け（3000ポート）
app.listen(3000, () => {
  console.log('Access to http://localhost:3000')
})
```

サーバを起動して次のようなテストデータをPOSTするとuser.dbにJSONが保存されます。

```
{ name: 'test' }
```

NeDBの命令セットはMongoDBに似ています。  
もう少し本格的なDBに触れたい場合はMongoDBの方がおすすめです。(今回は省略)  