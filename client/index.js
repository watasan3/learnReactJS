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