// requireでサーバモジュールをインポート
const config = require('config')
const axios = require('axios')
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
app.get('/api/user', (req, res) => {
  get({})
  .then(docs => {
    res.json(docs)
  })
})

// Postメソッド
app.post('/api/user', (req, res) => {
  axios
    .get('https://randomuser.me/api/')
    .then(res => res.data)
    .then(data => {
      post(data)
        .then( data => res.json(data))
        .catch( e => res.json({'error':e.toString()}))  
    })
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
app.listen(config.port, () => {
  console.log('Access to http://localhost:' + config.port)
})