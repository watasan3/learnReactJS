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