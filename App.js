import React from 'react'
// React Routerのコンポーネントを使う
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

/*
class Home extends React.Component {
  render () {
    // 返却するDOMが複数行になる場合は()で囲む
    return (
      <div>
        <h2>ホーム</h2>
      </div>
    )
  }
}
*/

// 上記のReactコンポーネントの簡略記法
const Home = () => (    
<div>
    <h2>ホーム</h2>
</div>
)

const Topic = ({ match }) => (
<div>
    <h3>{match.params.topicId}</h3>
</div>
)

const Topics = ({ match }) => (
<div>
    <h2>トピック</h2>
    <ul>
    <li>
        <Link to={`${match.url}/apple`}>
        Apple
        </Link>
    </li>
    <li>
        <Link to={`${match.url}/google`}>
        Google
        </Link>
    </li>
    </ul>

    <Route path={`${match.path}/:topicId`} component={Topic}/>
    <Route exact path={match.path} render={() => (
         <h3>トピックを選択してください</h3>
    )}/>
</div>
)

const App = () => (
<Router>
    <div>
    {/* ヘッダー部分 */}
    <ul>
        {/* Linkコンポーネントのtoにパスを記述、クリック時にRouteに対応するパスが呼ばれる */}
        <li><Link to="/">ホーム</Link></li>
        <li><Link to="/topics">トピック</Link></li>
    </ul>

    <hr/>

    {/* パスに応じてコンポーネントを動的に差し替える */}
    {/* exactは初期パス */}
    <Route exact path="/" component={Home}/>
    <Route path="/topics" component={Topics}/>
    </div>
</Router>
)
export default App