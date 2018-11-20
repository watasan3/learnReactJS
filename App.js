/*globals module: false */
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { hot } from 'react-hot-loader'

import asyncComponent from './AsyncComponent'

// 遅延レンダリング
// magicコメントでwebpackが勝手にファイル名をリネームするのを防ぐ
const UserPage = asyncComponent(() => import(/* webpackPrefetch: true, webpackChunkName: 'userpage' */ './components/UserPage'))
const TodoPage = asyncComponent(() => import(/* webpackPrefetch: true, webpackChunkName: 'todopage' */ './components/TodoPage'))
const NotFound = asyncComponent(() => import(/* webpackPrefetch: true, webpackChunkName: 'notfound' */ './components/NotFound'))

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
  <div>
    <Switch>
      <Route exact path="/" component={UserPage} />
      <Route path="/todo" component={TodoPage} />
      {/* それ以外のパス */}
      <Route component={NotFound} />
    </Switch>
  </div>
)