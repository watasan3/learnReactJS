/*globals module: false require: false */
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { hot } from 'react-hot-loader'

import asyncComponent from 'components/AsyncComponent'

// パフォーマンスのため遅延レンダリング
// magicコメントでwebpackが勝手にファイル名をリネームするのを防ぐ
const UserPage = asyncComponent(() => import(/* webpackPrefetch: true, webpackChunkName: 'userpage' */ 'components/pages/UserPage'))
const NotFound = asyncComponent(() => import(/* webpackPrefetch: true, webpackChunkName: 'notfound' */ 'components/pages/NotFound'))

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
    <Route exact path='/' component={UserPage} />
    {/* それ以外のパス */}
    <Route component={NotFound} />
  </Switch>
)


