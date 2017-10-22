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