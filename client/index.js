/*globals module: false process: false */
import React  from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from '@material-ui/core/styles'
import createHistory from 'history/createBrowserHistory'
import { createStore, applyMiddleware, compose } from 'redux'
import axios from 'axios'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'

import reducer from 'reducer/index'
import theme from './theme'
import App from './App'

const client = axios.create()

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

// api hook
axios.interceptors.request.use(req => {
  const user = localStorage.getItem('user')

  if (user) {
    // ユーザ認証トークン付与
    req.headers.Authorization = `Bearer ${user.token}`
  }
  return req
}, err => Promise.reject(err))

axios.interceptors.response.use(res => res, err => {
  if (axios.isCancel(err)) {
    return Promise.reject({code: 999, message: 'cancel'})
  }
  if (err.response.status && err.response.status === 401) {
    const user = localStorage.getItem('user') || {}
    user.token = ''
    localStorage.setItem('user', JSON.stringify(user))
  }
  return Promise.reject(err.response || {})
})


function render() {
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
