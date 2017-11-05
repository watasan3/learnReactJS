# ReactRouterReduxで画面遷移状態をストア管理

React Router Reduxを使うと画面遷移状態をhistoryオブジェクトで管理することができます。 
下記コマンドでreact-router-reduxとhistoryをインストールします。 

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

index.jsにてhistoryオブジェクトの作成、  
reduxのstoreに紐付け、Componentのpropsにhistoryオブジェクトを渡します。  

```index.js
import React  from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createHashHistory'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import client from 'axios'
import thunk from 'redux-thunk'
import { AppContainer } from 'react-hot-loader'
import { routerMiddleware } from 'react-router-redux'

import App from './App'
import reducer from './reducer/reducer'

// ブラウザ履歴保存用のストレージを作成
const history = createHistory()
// axiosをthunkの追加引数に加える
const thunkWithClient = thunk.withExtraArgument(client)
// routerMiddlewareとredux-thunkをミドルウェアに適用
const store = createStore(reducer, applyMiddleware(routerMiddleware(history),thunkWithClient))

const render = Component => {
  ReactDOM.render(
    <AppContainer warnings={false}>
      <Provider store={store}>
        <Component history={history} />
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

reducer.jsにrouterReducerを追加します。　　

```reducer.js
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import user from 'reducer/user'

export default combineReducers({
  routing: routerReducer,
  user
})
```

App.jsにてルーティングの指定をします。  
今回は  

* ユーザページ
* TODOページ
* NotFoundページ

を作成します。  
どの画面でもhistoryオブジェクトを扱えるようにRouterコンポーネントのpropsにhistoryを渡します。  

```App.js
import React from 'react'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route, Redirect, Switch } from 'react-router-dom'

// client/componentsフォルダ以下に格納
// webpack.config.jsにてresolveしているので絶対パス指定で読み込みできる
import NotFound from 'components/NotFound'
import UserPage from 'components/UserPage'
import TodoPage from 'components/TodoPage'

export default class App extends React.Component {
  render() {
    const { history } = this.props
    return (
      <Router history={history}>
        <Route component={AppRoute} />
      </Router>
    )
  }
}

const AppRoute = (props) => (
  <Switch>
    <Route exact path="/" component={UserPage} />
    <Route path="/todo" component={TodoPage} /> 
    {/* それ以外のパス */}
    <Route component={NotFound} />　
  </Switch>
)
```

`/`や`/todo`以外のときはNotFound.jsが呼ばれます。

```NotFound.js
import React from 'react'

export default class NotFound extends React.Component {
  render() {
    return  <div>NotFound</div>
  }
}
```

UserPage.jsです。  
前回とほぼ変わりませんがヘッダー部分にTodoリストページに遷移するためのメソッドを追加しています。  

```UserPage.js
import React from 'react'
import { connect } from 'react-redux';
import { load, add } from 'reducer/user'

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
export default class UserPage extends React.Component {

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

  handlePageMove(path) {
    this.props.history.push(path)
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
                ユーザページ
              </Typography>
              <Button style={{color:'#fff',position:'absolute',top:15,right:0}} onClick={()=> this.handlePageMove('/todo')}>TODOページへ</Button>
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

historyオブジェクトにて画面遷移ができるようになります。  
これによってLinkコンポーネントでprops指定することなく  
historyオブジェクト経由で遷移させることが可能になります。  
また、遷移履歴もhistoryオブジェクトで一元管理されているため、ブラウザバックなども有効に働きます。  

```
handlePageMove(path) {
  this.props.history.push(path)
}
```

ヘッダー部分にユーザページへ戻るリンクがあります。  

```TodoPage.js
import React from 'react'
import { connect } from 'react-redux';
import { load, add } from 'reducer/user'

import { withStyles } from 'material-ui/styles'
import { AppBar,Toolbar, Avatar, Card, CardContent, Button, Dialog, DialogTitle, DialogContent } from 'material-ui'
import Typography from 'material-ui/Typography'
import { Email } from 'material-ui-icons'


export default class TodoPage extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
  }

  handlePageMove(path) {
    this.props.history.push(path)
  }

  render () {
    const { todos } = this.props
    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    // console.log(users)
    return (
      <div>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography type="title" color="inherit">
                TODOページ
              </Typography>
              <Button style={{color:'#fff',position:'absolute',top:15,right:0}} onClick={()=> this.handlePageMove('/')}>ユーザページへ</Button>
            </Toolbar>
          </AppBar>
      </div>
    )
  }
}
```