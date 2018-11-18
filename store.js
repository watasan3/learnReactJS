import createHistory from 'history/createBrowserHistory'
import { createStore, applyMiddleware, compose } from 'redux'

import client from 'axios'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'

import reducer from './reducer/reducer'

// redux-devtoolの設定
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// 本番時はredux-devtoolを無効化する
if (process.env.NODE_ENV === 'production') {
  composeEnhancers = compose
}

const initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'))

// ブラウザ履歴保存用のストレージを作成
export const history = createHistory()
// axiosをthunkの追加引数に加える
const thunkWithClient = thunk.withExtraArgument(client)
// redux-thunkをミドルウェアに適用、historyをミドルウェアに追加
export const store = createStore(connectRouter(history)(reducer), initialData, composeEnhancers(applyMiddleware(routerMiddleware(history), thunkWithClient)))
