# サーバとクライアントを統合する
クライアント側をReactJSで
APIはexpressサーバで１つにまとめて開発できる環境を構築します。
下記のような構成にします。  
clientフォルダにはReactのモジュールを実装します。  
serverフォルダにはexpressの実装をします。

```
├── README.md
├── client
│   ├── App.js
│   ├── index.js
│   ├── reducer.js
│   ├── static
│   │   └── index.html
│   └── user.js
├── package.json
├── server
│   └── server.js
└── webpack.config.js
```
  
下記パッケージを追加でインストールします。  

```
$npm install --save-dev react-hot-loader npm-run-all node-dev express nedb
```

scriptsに下記のスクリプトを追記します。 
node-all-runコマンドで  
並列でスクリプトを実行することができます。  

```
"scripts": {
  "dev:client": "webpack-dev-server",
  "dev:server": "node-dev --inspect ./server/server.js",
  "dev": "run-p dev:client dev:server"
},
``` 

追加後のpackage.jsonは次のようになります。  

```package.json
{
  "name": "learnReactJS",
  "version": "1.0.0",
  "description": "ReactJSでDOMをレンダリングするには",
  "main": "index.js",
  "scripts": {
    "dev:client": "webpack-dev-server",
    "dev:server": "node-dev --inspect ./server/server.js",
    "dev": "run-p dev:client dev:server"
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
  "devDependencies": {
    "axios": "^0.16.2",
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-plugin-transform-decorators-legacy": "^1.3.4",
    "babel-plugin-transform-react-jsx": "^6.24.1",
    "babel-polyfill": "^6.26.0",
    "babel-preset-react": "^6.24.1",
    "express": "^4.16.2",
    "material-ui": "^1.0.0-beta.17",
    "material-ui-icons": "^1.0.0-beta.17",
    "nedb": "^1.8.0",
    "node-dev": "^3.1.3",
    "npm-run-all": "^4.1.1",
    "react": "^16.0.0",
    "react-dom": "^16.0.0",
    "react-hot-loader": "^3.1.1",
    "react-redux": "^5.0.6",
    "react-router-dom": "^4.2.2",
    "react-router-redux": "^4.0.8",
    "redux": "^3.7.2",
    "redux-devtools": "^3.4.0",
    "redux-thunk": "^2.2.0",
    "webpack": "^3.8.1",
    "webpack-dev-server": "^2.9.3"
  }
}
```


## React Hot Loaderによる自動リロード
ソースコード変更時のwebpackビルドを  
`webpack --watch`により行っていましたが  
React hot Loaderの設定を行うことで  
webpackビルド完了後にブラウザを自動リロードしてくれます。  
webpack.config.jsにreact-hot-loaderの設定を追加します。  

```webpack.config.js
const webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル追加 
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    __dirname + '/client/index', // エントリポイントのjsxファイル
  ],
  devServer: {
    contentBase: __dirname + '/client/static',
    inline: true, // ソース変更時リロードモード
    hot: true, // HMR(Hot Module Reload)モード
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
      include: __dirname + '/client',// client配下のJSファイルが対象
      use: {
        loader: 'babel-loader',
        options: {
          plugins: ["transform-react-jsx","babel-plugin-transform-decorators-legacy","react-hot-loader/babel"] // babelのtransform-react-jsxプラグインを使ってjsxを変換
        }
      }
    }]
  }
}
```

client/index.jsにReact Hot Loaderの設定を追加します。  

```index.js
import React  from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import client from 'axios'
import thunk from 'redux-thunk'
import { AppContainer } from 'react-hot-loader'

import App from './App'
import reducer from './reducer'

// axiosをthunkの追加引数に加える
const thunkWithClient = thunk.withExtraArgument(client)
// redux-thunkをミドルウェアに適用
const store = createStore(reducer, applyMiddleware(thunkWithClient))

const render = Component => {
  ReactDOM.render(
    <AppContainer warnings={false}>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  )
}

render(App)

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => { render(App) })
}
```

## サーバプログラム
サーバ側でユーザを追加、ユーザ取得できるようにプログラムを修正します。

```server.js
// requireでサーバモジュールをインポート
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

// CORSを許可する
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

// Getメソッド
app.get('/user', (req, res) => {
  // DBの全データ検索
  get({})
  .then(docs => {
    res.json(docs)
  })
})

// Postメソッド
app.post('/user', (req, res) => {
  // Random Userよりユーザ取得してDBに追加
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
app.listen(3000, () => {
  console.log('Access to http://localhost:3000')
})
```

## クライアント側の修正
user.jsを修正します。

```user.js
// reducerで受け取るaction名を定義
const LOAD = 'user/LOAD'
const ADD = 'user/ADD'

// 初期化オブジェクト
const initialState = {
  users: null,
}

// reducerの定義（dispatch時にコールバックされる）
export default function reducer(state = initialState, action = {}){
  // actionの種別に応じてstateを更新する
  switch (action.type) {
    case LOAD:
      // ユーザ一覧取得
      return {
        users:action.results,
      }
    case ADD:
      // ユーザ一覧末尾にユーザを追加する
      return {
        users: [...state.users, action.results]
      }
    default:
      // 初期化時はここに来る（initialStateのオブジェクトが返却される）
      return state
  }
}

// actionの定義
export function load() {
  // ユーザ一覧を取得
  return (dispatch, getState, client) => {
    return client
      .get('http://localhost:3000/user')
      .then(res => res.data)
      .then(data => {
        const results = data
        // dispatchしてreducer呼び出し
        dispatch({ type: LOAD, results })
      })
  }
}

export function add() {
  // ユーザを追加
  return (dispatch, getState, client) => {
    return client
      .post('http://localhost:3000/user')
      .then(res => res.data)
      .then(data => {
        const results = data
        // dispatchしてreducer呼び出し
        dispatch({ type: ADD, results })
      })
  }
}
```

App.jsを修正してユーザ追加ボタンを作成し、ユーザ追加APIを呼ぶようにします。

```App.js
import React from 'react'
import { connect } from 'react-redux';
import { load, add } from './user'

import { withStyles } from 'material-ui/styles'
import { AppBar,Toolbar, Avatar, Card, CardContent, Button, Dialog, DialogTitle, DialogContent } from 'material-ui'
import Typography from 'material-ui/Typography'
import { Email } from 'material-ui-icons'


// connectのdecorator
@connect(
  // propsに受け取るreducerのstate
  state => ({
    users: state.user.users
  }),
  // propsに付与するactions
  { load, add }
)
export default class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      open:false,
      user:null,
    }
  }

  componentWillMount() {
    // user取得APIコールのactionをキックする
    this.props.load()
  }

  handleClickOpen (user) {
    this.setState({
      open: true,
      user: user,
    })
  }

  handleRequestClose () {
    this.setState({ open: false })
  }

  handleAdd() {
    // user追加APIコールのactionをキックする
    this.props.add()
  }

  render () {
    const { users } = this.props
    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    // console.log(users)
    return (
      <div>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography type="title" color="inherit">
                タイトル
              </Typography>
            </Toolbar>
          </AppBar>
          {/* 配列形式で返却されるためmapで展開する */}
          {users && users.map((obj) => {
            const user = obj.results[0]
            return (
                // ループで展開する要素には一意なkeyをつける（ReactJSの決まり事）
                <Card key={user.email} style={{marginTop:'10px'}}>
                  <CardContent style={{color:'#408040'}}>
                    <Avatar src={user.picture.thumbnail} />
                    <p style={{margin:10}}>{'名前:' + user.name.first + ' ' + user.name.last} </p>
                    <p style={{margin:10}}>{'性別:' + (user.gender == 'male' ? '男性' : '女性')}</p>
                    <div style={{textAlign: 'right'}} >
                      <Button onClick={() => this.handleClickOpen(user)}><Email/>メールする</Button>                    
                    </div>
                  </CardContent>
                </Card>    
            )
          })}
          {
            this.state.open &&
            <Dialog open={this.state.open} onRequestClose={() => this.handleRequestClose()}>
              <DialogTitle>メールアドレス</DialogTitle>
              <DialogContent>{this.state.user.email}</DialogContent>
            </Dialog>
          }  
          <Button style={{marginTop:10}} raised onClick={() => this.handleAdd()}>ユーザ追加</Button>
      </div>
    )
  }
}
```