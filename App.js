/*globals module: false require: false */
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { hot } from 'react-hot-loader'
import { store } from './store'

import asyncComponent from './AsyncComponent'

export default async function Component() {
  // SSRするページは同期読み込みする必要がある
  // それ以外はパフォーマンスのため遅延レンダリング
  // magicコメントでwebpackが勝手にファイル名をリネームするのを防ぐ
  const UserPage = store.getState().landing.page === 'UserPage' ?
    (await import(/* webpackPrefetch: true, webpackChunkName: 'userpage' */ './components/UserPage')).default :
    asyncComponent(() => import(/* webpackPrefetch: true, webpackChunkName: 'userpage' */ './components/UserPage'))
  const TodoPage = store.getState().landing.page === 'TodoPage' ?
    (await import(/* webpackPrefetch: true, webpackChunkName: 'todopage' */ './components/TodoPage')).default :
    asyncComponent(() => import(/* webpackPrefetch: true, webpackChunkName: 'todopage' */ './components/TodoPage'))
  const NotFound = asyncComponent(() => import(/* webpackPrefetch: true, webpackChunkName: 'notfound' */ './components/NotFound'))


  @hot(module)
  class App extends React.Component {
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

  return App
}

