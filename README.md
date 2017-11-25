# ReduxFormでのバリデーションチェックとフォーム投稿

ReduxFormを使うとReactでのバリデーションチェックとフォーム投稿が構造化できます。  
次のnpmコマンドでReduxFormをダウンロードします。

```
$ npm install redux-form
```

reducer.jsにReduxFormのreducerを追加します。

```reducer.js
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form' // as は名前がかぶらないようにインポート時に別名にできる

import user from 'reducer/user'

export default combineReducers({
  routing: routerReducer,
  form: formReducer, // 追加
  user
})
```