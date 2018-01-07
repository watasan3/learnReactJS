# ReactRouterReduxで画面遷移状態をストア管理

React RouterとReact Router Reduxを使うと画面遷移状態をhistoryオブジェクトで管理することができます。  
下記コマンドでreact-router-domとreact-router-reduxとhistoryをインストールします。  
React Routerはバージョンごとで破壊的変更が入って互換性がないためv４を使用します。  

```
$npm install --save-dev react-router-dom@4.2.2 history react-router-redux@next
```

webpack.config.jsonのdevServerにhistoryApiFallbackをtrueにします。後で使うhistory APIのブラウザリロード時に対応します。

```webpack.config.js
  // React Hot Loader用のデバッグサーバ(webpack-dev-server)の設定
  devServer: {
    historyApiFallback: true, // history APIが404エラーを返す時、index.htmlに遷移(ブラウザリロード時など) 
```

index.jsにてcreateHistoryメソッドにてhistoryオブジェクトの作成、  
historyオブジェクトをミドルウェア追加でreduxのstoreに格納します。  
Appコンポーネントのpropsにhistoryオブジェクトを渡します。  

```index.js
import React  from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createBrowserHistory' // 追加
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
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
// redux-thunkをミドルウェアに適用、historyをミドルウェアに追加
const store = createStore(reducer, applyMiddleware(routerMiddleware(history),thunkWithClient))


// Material-UIテーマを上書きする
const theme = createMuiTheme({})

const render = Component => {
  ReactDOM.render(
    <AppContainer warnings={false}>
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Component history={history} />
        </Provider>
      </MuiThemeProvider>
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

import user from './user'

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
import { Route, Switch } from 'react-router-dom'

import NotFound from './components/NotFound'
import UserPage from './components/UserPage'
import TodoPage from './components/TodoPage'

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

Switchコンポーネントで対象のパスをグルーピングします。
exactはパスの完全一致指定です。この指定がないと/todoでもUserPageのコンポネントがレンダリングされてしまいます。
`/`や`/todo`以外のときはパス未指定のNotFoundコンポーネントが呼ばれます。

```NotFound.js
import React from 'react'

export default class NotFound extends React.Component {
  render() {
    return  <div>NotFound</div>
  }
}
```

UserPage.jsです。  
ほぼ変わりませんがヘッダー部分にTodoリストページに遷移するためのhandlePageMoveメソッドを追加しています。  

```UserPage.js
// 略

export default class UserPage extends React.Component {

  // 略

  handlePageMove(path) {
    this.props.history.push(path)
  }
  
  render () {
    const { users, theme, classes, width } = this.props
    const { primary, secondary } = theme.palette

    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    // console.log(users)
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar classes={{root: classes.root}}>
            ユーザページ({ width === 'xs' ? 'スマホ' : 'PC'})
            <Button style={{color:'#fff',position:'absolute',top:15,right:0}} onClick={()=> this.handlePageMove('/todo')}>TODOページへ</Button>
          </Toolbar>
        </AppBar>
        {/* 略 */}
      </div>
    )
  }
}
```

Router直下のコンポーネントはprops.match、props.location、props.historyが使えるようになります。  
historyオブジェクトにて画面遷移ができるようになります。  
また、遷移履歴もhistoryオブジェクトで一元管理されているため、ブラウザバックなども有効に働きます。  
URL部分を取得したい場合はprops.matchを使います。  

```
handlePageMove(path) {
  this.props.history.push(path)
}
```

ヘッダー部分にユーザページへ戻るリンクがあります。  

```TodoPage.js
import React from 'react'
import { AppBar, Toolbar, Button } from 'material-ui'
import { withStyles } from 'material-ui/styles'

@withStyles({
  root: {
    fontStyle: 'italic',
    fontSize: 21,
    minHeight: 64,
  }
})
export default class TodoPage extends React.Component {

  handlePageMove(path) {
    this.props.history.push(path)
  }

  render () {
    const { classes } = this.props
    
    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    // console.log(users)
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar classes={{root: classes.root}}>
              TODOページ
            <Button style={{color:'#fff',position:'absolute',top:15,right:0}} onClick={()=> this.handlePageMove('/')}>ユーザページへ</Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}
```