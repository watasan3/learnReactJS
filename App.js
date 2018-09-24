import React from 'react'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route, Redirect, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import NotFound from './components/NotFound'
import UserPage from './components/UserPage'
import TodoPage from './components/TodoPage'

@hot(module)
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