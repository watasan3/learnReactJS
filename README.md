# ReactRouterで画面遷移と遷移履歴の管理

React Connected React Routerを使うと画面遷移状態をhistoryオブジェクトで管理することができます。  
下記コマンドでreact-router-domとconnected-react-routerとhistoryをインストールします。  
React Routerはバージョンごとで破壊的変更が入って互換性がないためv４を使用します。  

```
$ yarn add --dev react-router-dom@4.3.1 history connected-react-router
```

webpack.config.jsonのdevServerにhistoryApiFallbackをtrueにします。  
後で使うhistory APIのブラウザリロード時に対応します。

```webpack.config.js
  // React Hot Loader用のデバッグサーバ(webpack-dev-server)の設定
  devServer: {
    historyApiFallback: true, // history APIが404エラーを返す時、index.htmlに遷移(ブラウザリロード時など) 
```

index.jsにてcreateHistoryメソッドにてhistoryオブジェクトの作成、  
historyオブジェクトをrouterMiddlewareに追加でreduxのstoreに格納します。  
その後、Appコンポーネントのpropsにhistoryオブジェクトを渡します。  

```index.js
import createHistory from 'history/createBrowserHistory' // 追加
import { connectRouter, routerMiddleware } from 'connected-react-router' // 追加

import App from './App'
import reducer from './reducer/reducer'

// redux-devtoolの設定
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// ブラウザ履歴保存用のストレージを作成
const history = createHistory()
// axiosをthunkの追加引数に加える
const thunkWithClient = thunk.withExtraArgument(client)
// redux-thunkをミドルウェアに適用、historyをミドルウェアに追加（routerのミドルウェアを追加）
const store = createStore(connectRouter(history)(reducer), composeEnhancers(applyMiddleware(routerMiddleware(history),thunkWithClient)))

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
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { hot } from 'react-hot-loader'

import NotFound from './components/NotFound'
import UserPage from './components/UserPage'
import TodoPage from './components/TodoPage'

@hot(module)
export default class App extends React.Component {
  render() {
    const { history } = this.props
    return (
      <ConnectedRouter history={history}>
        <Route component={AppRoute} />
      </ConnectedRouter>
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
import { AppBar, Toolbar, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

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