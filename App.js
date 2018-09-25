/*globals module: false */
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

const AppRoute = () => (
  <Switch>
    <Route exact path="/" component={UserPage} />
    <Route path="/todo" component={TodoPage} />
    {/* それ以外のパス */}
    <Route component={NotFound} />
  </Switch>
)