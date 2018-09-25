/*globals module: false */
import React from 'react'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import asyncComponent from './AsyncComponent'

// 遅延レンダリング
// magicコメントでwebpackが勝手にファイル名をリネームするのを防ぐ
const UserPage = asyncComponent(() => import(/* webpackChunkName: 'userpage' */ './components/UserPage'))
const TodoPage = asyncComponent(() => import(/* webpackChunkName: 'todopage' */ './components/TodoPage'))
const NotFound = asyncComponent(() => import(/* webpackChunkName: 'notfound' */ './components/NotFound'))

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

const AppRoute = () => (
  <div>
    <Switch>
      <Route exact path="/" component={UserPage} />
      <Route path="/todo" component={TodoPage} />
      {/* それ以外のパス */}
      <Route component={NotFound} />
    </Switch>
  </div>
)