# Reduxによる状態制御

Reduxを用いることでアプリケーション全体の状態を管理し、  
イベントコールバック→一元管理されたストアのパラメータ更新→描画反映  
といったことが楽になります。  
（類似のフレームワークにfluxがあります。）  
参考：[ToDoアプリで学ぶReact/Redux入門/vtecx2_lt2](https://speakerdeck.com/nishina555/vtecx2-lt2)  
参考：[Redux入門【ダイジェスト版】10分で理解するReduxの基礎](https://qiita.com/kiita312/items/49a1f03445b19cf407b7)  
参考：[React+Redux入門](https://qiita.com/erukiti/items/e16aa13ad81d5938374e)  
SPAなReactJSと特に相性が良いです。  
  
Reduxは次の思想で設計されています。  

1. ストアがいっぱいあると不整合が起きるのでビューに使うコンポーネントから分離して１つのストアに格納する
2. ストアの状態を更新するためには決められたアクション経由で行う
3. Stateの変更を行うReducerはシンプルな関数(Pure関数)にする

ReactとReduxを連動させるためにはreact-reduxのnpmパッケージを使うのですが  
connectの記述方法がいくつもあり混乱します。  
[ReactとReduxを結ぶパッケージ「react-redux」についてconnectの実装パターンを試す](https://qiita.com/MegaBlackLabel/items/df868e734d199071b883)  
  
今回は可読性の良さを重視して、decoratorsを使って実装します。  
追加で下記のRedux関連のパッケージをインストールします。  

```
$ yarn add --dev babel-plugin-transform-decorators-legacy redux redux-devtools redux-thunk react-redux react-router-redux 
```

react-reduxを実際に使う場面は通信や画面遷移周りだと思います。  
redux-thunkを使うとaction部分の処理を非同期にできます。  
  
通信用のライブラリ（axios）をインストールします  

```
$ yarn add --dev axios
```

decoratorの文法を使うので  
babel-plugin-transform-decorators-legacyのプラグインを  
webpack.config.jsに追加します。  

```webpack.config.js
module.exports = {
    entry: './index.js', // エントリポイントのjsxファイル
    output: {
      filename: 'bundle.js' // 出力するファイル
    },
    module: {
      loaders: [{
        test: /\.js?$/, // 拡張子がjsで
        exclude: /node_modules/, // node_modulesフォルダ配下でなければ
        loader: 'babel-loader', // babel-loaderを使って変換する
        query: {
          plugins: ["transform-react-jsx","babel-plugin-transform-decorators-legacy"] // babelのtransform-react-jsxプラグインを使ってjsxを変換
        }
      }]
    }
  }  
```

user.jsにuser情報を取得するactionとreducerを記述します。  
Random User Generatorで生成した疑似ユーザ情報をAPIで取得するactionを作成します。  
redux-thunkを使うとaction部分を非同期で記述できます。  

```user.js
// reducerで受け取るaction名を定義
const LOAD = 'user/LOAD'

// 初期化オブジェクト
const initialState = {
  users: null,
}

// reducerの定義（dispatch時にコールバックされる）
export default function reducer(state = initialState, action = {}){
  // actionの種別に応じてstateを更新する
  switch (action.type) {
    case LOAD:
      return {
        users:action.results,
      }
    default:
      // 初期化時はここに来る（initialStateのオブジェクトが返却される）
      return state
  }
}

// actionの定義
export function load() {
  // clientはaxiosの付与したクライアントパラメータ（後述）
  // 非同期処理をPromise形式で記述できる
  return (dispatch, getState, client) => {
    return client
      .get('https://randomuser.me/api/')
      .then(res => res.data)
      .then(data => {
        const results = data.results
        // dispatchしてreducer呼び出し
        dispatch({ type: LOAD, results })
      })
  }
}
```

reducer.jsに読み込むreducerを記述します

```reducer.js
import { combineReducers } from 'redux'
// 作成したuserのreducer
import user from './user'

// 作成したreducerをオブジェクトに追加していく
// combineReducersで１つにまとめてくれる
export default combineReducers({
  user,
})
```

index.jsにてReduxのstoreを作成し  
storeにreducerを適応します。  
redux-thunkミドルウェアを適応することで  
actionにaxiosオブジェクトが引数として渡るようになります。  

```index.js
import React  from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import client from 'axios'
import thunk from 'redux-thunk'

import App from './App'
import reducer from './reducer'

// axiosをthunkの追加引数に加える
const thunkWithClient = thunk.withExtraArgument(client)
// redux-thunkをミドルウェアに適用
const store = createStore(reducer, applyMiddleware(thunkWithClient))

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
)
```

App.jsでuser情報取得のactionをキック、reducer経由でのstate更新を行います。

```App.js
import React from 'react'
import { connect } from 'react-redux';
import { load } from './user'

// connectのdecorator
@connect(
  // propsに受け取るreducerのstate
  state => ({
    users: state.user.users
  }),
  // propsに付与するactions
  { load }
)
export default class App extends React.Component {

  componentWillMount() {
    // user取得APIコールのactionをキックする
    this.props.load()
  }

  render () {
    const { users } = this.props
    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    console.log(users)
    return (
      <div>
          {/* 配列形式で返却されるためmapで展開する */}
          {users && users.map((user) => {
            return (
                // ループで展開する要素には一意なkeyをつける（ReactJSの決まり事）
                <div key={user.email}>
                  <img src={user.picture.thumbnail} />
                  <p>名前:{user.name.first + ' ' + user.name.last}</p>
                  <p>性別:{user.gender}</p>
                  <p>email:{user.email}</p>
                </div>
            )
          })}
      </div>
    )
  }
}
```

このようにコンポーネントで管理したくないビジネスロジックデータはReduxで管理します。
ちなみにdecoratorsを使わないApp.jsの実装は次のようになります。

```App.js
import React from 'react'
import { connect } from 'react-redux';
import { load } from './user'

class App extends React.Component {

  componentWillMount() {
    // user取得APIコールのactionをキックする
    this.props.load()
  }

  render () {
    const { users } = this.props
    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    console.log(users)
    return (
      <div>
          {/* 配列形式で返却されるためmapで展開する */}
          {users && users.map((user) => {
            return (
                // ループで展開する要素には一意なkeyをつける（ReactJSの決まり事）
                <div key={user.email}>
                  <img src={user.picture.thumbnail} />
                  <p>名前:{user.name.first + ' ' + user.name.last}</p>
                  <p>性別:{user.gender}</p>
                  <p>email:{user.email}</p>
                </div>
            )
          })}
      </div>
    )
  }
}

export default connect(
  state => ({
    users: state.user.users
  }),
  { load }  
)(App)
```