/*globals module: false process: false */
import React  from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from '@material-ui/core/styles'
import createHistory from 'history/createBrowserHistory'
import { createStore, applyMiddleware, compose } from 'redux'
import client from 'axios'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'

import reducer from 'reducer/index'
import theme from './theme'
import App from './App'

// redux-devtoolの設定
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// 本番時はredux-devtoolを無効化する
if (process.env.NODE_ENV === 'production') {
  composeEnhancers = compose
}

const initialData = {}

// ブラウザ履歴保存用のストレージを作成
const history = createHistory()
// axiosをthunkの追加引数に加える
const thunkWithClient = thunk.withExtraArgument(client)
// redux-thunkをミドルウェアに適用、historyをミドルウェアに追加
const store = createStore(connectRouter(history)(reducer), initialData, composeEnhancers(applyMiddleware(routerMiddleware(history), thunkWithClient)))

async function render() {

  ReactDOM.hydrate(
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <App history={history} />
      </Provider>
    </MuiThemeProvider>,
    document.getElementById('root'),
  )
}

render()
