# React Routerによる画面遷移

ページ遷移（画面切り替え）するにはReact-Routerを使います。  
React-Routerはバージョンで互換性がないので今回の説明では4系を使います。  
React-Routerをインストールします。  
  
```
$npm install -D react-router-dom@4.2.2
```

App.jsを次のように修正してください。  

```App.js
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
```

React Routerはサーバー上でないとCORSの制約にひっかかるので  
簡易的なサーバ上で動かします。  
npmのserveモジュールをインストールします。  

```
$npm install -g serve
```

次のserveコマンドを実行するとカレントディレクトリがサーバのpublicフォルダになります。

```
$ serve .

   ┌──────────────────────────────────────────────────┐
   │                                                  │
   │   Serving!                                       │
   │                                                  │
   │   - Local:            http://localhost:5000      │
   │   - On Your Network:  http://192.168.1.28:5000   │
   │                                                  │
   │   Copied local address to clipboard!             │
   │                                                  │
   └──────────────────────────────────────────────────┘
```

http://localhost:5000
にアクセスしてみてください

もう少し複雑なことをしたい場合は下記記事が参考になると思います。  
react-router@v4を使ってみよう：シンプルなtutorial  