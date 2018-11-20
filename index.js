/*globals module: false process: false */
import React  from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import { store, history } from './store'

async function render() {
  const App = await require('./App').default()

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
