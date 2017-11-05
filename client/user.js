// reducerで受け取るaction名を定義
const LOAD = 'user/LOAD'
const ADD = 'user/ADD'

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
    case ADD:
      return {
        users: [...state.users, action.results]
      }
    default:
      // 初期化時はここに来る（initialStateのオブジェクトが返却される）
      return state
  }
}

// actionの定義
export function load() {
  // clientはaxiosの付与したクライアントパラメータ
  // 非同期処理をPromise形式で記述できる
  return (dispatch, getState, client) => {
    return client
      .get('http://localhost:3000/user')
      .then(res => res.data)
      .then(data => {
        const results = data
        // dispatchしてreducer呼び出し
        dispatch({ type: LOAD, results })
      })
  }
}

export function add() {
  // clientはaxiosの付与したクライアントパラメータ
  // 非同期処理をPromise形式で記述できる
  return (dispatch, getState, client) => {
    return client
      .post('http://localhost:3000/user')
      .then(res => res.data)
      .then(data => {
        const results = data
        // dispatchしてreducer呼び出し
        dispatch({ type: ADD, results })
      })
  }
}