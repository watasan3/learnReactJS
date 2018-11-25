const express = require('express')
const ah = require('async_hooks')
const fs = require('fs')
const bodyParser = require('body-parser')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const app = express()

// 非同期I/O, タイマー, Promiseなどのトレース
Error.stackTraceLimit = 20 // スタックトレース行を増やす
const w = v => fs.writeSync(process.stdout.fd, v)
ah.createHook({
  init(id, type, triggerId) {
    const e = {}
    Error.captureStackTrace(e) // -> 'at AsyncHook init'
    // ユーザーランドのスタックトレースのみに
    e.stack.split(require('os').EOL).filter(v => v.includes(' (/') && !v.includes('at AsyncHook.init'))
    w(`${type} ${id} created in ${triggerId}\n`)
  },
  before(id) {
    w(`before ${id} callback in ${ah.executionAsyncId()}\n`)
  },
  after(id) {
    w(`after ${id} callback in ${ah.executionAsyncId()}\n`)
  },
  destroy(id) {
    w(`${id} destroy in ${ah.executionAsyncId()}\n`)
  },
  promiseResolve(id) {
    w(`PROMISE ${id} resolved\n`)
  },
}).enable()

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(err => {
  console.error(err)
  if (!res.headersSent) {
    res.status(500).json({message: 'Internal Server Error'})
  }
})
process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))
process.on('SIGINT', () => process.exit(1))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./dist'))
} else {
  app.use(express.static('../static'))
}
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.post('/api/upload', upload.single('image'), wrap(async (req, res) => {
  console.log(req.body)
  console.log(req.file)
  res.json({image: req.file, ...req.body})
}))

app.listen(7000, () => {
  console.log('Access to http://localhost:7000')
})