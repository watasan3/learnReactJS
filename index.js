/*globals module: false process: false */
import React  from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from 'material-ui/styles'
import client from 'axios'
import thunk from 'redux-thunk'
import { AppContainer } from 'react-hot-loader'
import { routerMiddleware } from 'react-router-redux'

import reducer from './reducer/reducer'
import theme from './theme'

import App from './App'

// redux-devtoolの設定
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// 本番時はredux-devtoolを無効化する
if (process.env.NODE_ENV === 'production') {
  composeEnhancers = compose
}


const render = Component => {
  const initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'))

  // ブラウザ履歴保存用のストレージを作成
  const history = createHistory()
  // axiosをthunkの追加引数に加える
  const thunkWithClient = thunk.withExtraArgument(client)
  // redux-thunkをミドルウェアに適用、historyをミドルウェアに追加
  const store = createStore(reducer, initialData, composeEnhancers(applyMiddleware(routerMiddleware(history), thunkWithClient)))

  ReactDOM.hydrate(
    <AppContainer>
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
  module.hot.accept('./App', () => {
    render(App)
  })
}