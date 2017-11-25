# ReduxFormでのバリデーションチェックとフォーム投稿

[ReduxForm](https://redux-form.com/7.1.2/)を使うとReactでのバリデーションチェックとフォーム投稿が構造化できます。  
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

TodoPage.jsにReduxFormにてフォームを作成します。  
`@reduxForm`デコレータで入力変更時のバリデーションチェックを行います。  
送信対象の項目はFieldコンポーネントで定義します。  
`component`には対象のDOMを指定します。  
今回はMaterial-uiのTextFieldコンポーネントとselectタグを指定します。  
submit時はhandleSubmitにsendItemsメソッドを指定して送信処理をキックします。  

```TodoPage.js
import React from 'react'
import { connect } from 'react-redux';
import { customadd } from 'reducer/user'

import { withStyles } from 'material-ui/styles'
import { AppBar,Toolbar, Avatar, Card, CardContent, Button, TextField } from 'material-ui'
import Typography from 'material-ui/Typography'
import { Email } from 'material-ui-icons'
import { Field, reduxForm } from 'redux-form'
import { error } from 'util';

const FormTextField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => {
  const isError = !!(touched && error)
  return (
    <TextField style={{margin:5}} error={isError} label={label} helperText={isError ? error : null} {...input} type={type} />
  )
}

// connectのdecorator
@connect(
  // propsに受け取るreducerのstate
  state => ({}),
  // propsに付与するactions
  { customadd }
)
@reduxForm({
  form: 'syncValidation',
  validate: values => {
    
    // 入力変更時にパラメータが渡ってくる
    const errors = {}
    if (!values.firstname) {
      errors.firstname = '必須項目です'
    } 
    if (!values.lastname) {
      errors.lastname = '必須項目です'
    } 
    if (!values.email) {
      errors.email = '必須項目です'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'メールアドレスとして認識できません'
    }
    
    return errors
  }
})
export default class TodoPage extends React.Component {

  constructor(props) {
    super(props)
    this.sendItems = this.sendItems.bind(this)
  }

  handlePageMove(path) {
    this.props.history.push(path)
  }

  sendItems(values) {
    const user = {
      firstname: values.firstname,
      lastname: values.lastname,
      gender: values.gender || 'male',
      email: values.email
    }
    this.props.customadd(user).then( () => alert('送信完了')) // sendItemsメソッド内でthisを使えるようにbindする
  }

  render () {
    const { handleSubmit, submitting } = this.props

    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography type="title" color="inherit">
              TODOページ
            </Typography>
            <Button style={{color:'#fff',position:'absolute',top:15,right:0}} onClick={()=> this.handlePageMove('/')}>ユーザページへ</Button>
          </Toolbar>
        </AppBar>
        <Card style={{padding:10}}>
          <form onSubmit={handleSubmit(this.sendItems)}>
            <Field name="firstname" type="text" component={FormTextField} label="姓" />
            <Field name="lastname" type="text" component={FormTextField} label="名" />
            <div style={{margin:5}}>
              <label style={{marginRight: 5}}>性別：</label>
              <span>
                <Field name="gender" component="select">
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                </Field>
              </span>
            </div>
            <Field name="email" type="email" component={FormTextField} label="メールアドレス" />
            <br/>
            <Button style={{marginTop:10}} raised type="submit" disabled={submitting}>送信</Button>
          </form>
        </Card>
      </div>
    )
  }
}
```

reducer/user.jsに入力データ送信用のactionを追加します。（CUSTOMADD）

```user.js
// reducerで受け取るaction名を定義
const LOAD = 'user/LOAD'
const ADD = 'user/ADD'
const CUSTOMADD = 'user/CUSTOMADD'

// 初期化オブジェクト
const initialState = {
  users: null,
}

// reducerの定義（dispatch時にコールバックされる）
export default function reducer(state = initialState, action = {}){
  // actionの種別に応じてstateを更新する
  switch (action.type) {
    case LOAD:
      // ユーザ一覧取得
      return {
        users:action.results,
      }
    case ADD:
      // ユーザ一覧末尾にユーザを追加する
      return {
        users: [...state.users, action.results]
      }
    case CUSTOMADD:
      // ユーザ一覧末尾にユーザを追加する
      return {
        users: state.users ? [...state.users, action.results] : [action.results]
      }
    default:
      // 初期化時はここに来る（initialStateのオブジェクトが返却される）
      return state
  }
}

// actionの定義
export function load() {
  // ユーザ一覧を取得
  return (dispatch, getState, client) => {
    return client
      .get('/api/user')
      .then(res => res.data)
      .then(data => {
        const results = data
        // dispatchしてreducer呼び出し
        dispatch({ type: LOAD, results })
      })
  }
}

export function add() {
  // ユーザを追加
  return (dispatch, getState, client) => {
    return client
      .post('/api/user')
      .then(res => res.data)
      .then(data => {
        const results = data
        // dispatchしてreducer呼び出し
        dispatch({ type: ADD, results })
      })
  }
}

export function customadd(data) {
  // 入力ユーザを追加
  return (dispatch, getState, client) => {
    return client
      .post('/api/user/input',{user:data})
      .then(res => res.data)
      .then(data => {
        const results = data
        // dispatchしてreducer呼び出し
        dispatch({ type: CUSTOMADD, results })
      })
  }
}
```

入力登録用のAPIをserver.jsに追加します。

```server.js
app.post('/api/user/input', (req, res) => {
  const user = req.body.user
  const data = {"results":[{"gender":user.gender,"name":{"first":user.firstname,"last":user.lastname},"email":user.email,"picture":{"thumbnail":"https://avatars1.githubusercontent.com/u/771218?s=460&v=4"}}]}
  post(data)
    .then( data => res.json(data))
    .catch( e => res.json({'error':e.toString()}))  
})
```