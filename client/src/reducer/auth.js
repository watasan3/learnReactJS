import { SubmissionError } from 'redux-form'

const CREATE = 'auth/CREATE'
const SHOW = 'auth/SHOW'
const UPDATE = 'auth/UPDATE'

const initialState = {
  user: localStorage.getItem('user'),
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE:
      // ユーザ登録時認証トークン保存
      localStorage.setItem('user', JSON.stringify(action.user))

      return {
        ...state,
        user: action.user || state.user,
      }
    case SHOW:
      return {
        ...state,
        user: action.user || state.user,
      }
    case UPDATE:
      return {
        ...state,
        user: action.user || state.user,
      }
    default:
      return state
  }
}


export function create(data) {
  return (dispatch, getState, client) => {
    return client
      .post('/api/user', data)
      .then(res => res.data)
      .then(user => {
        dispatch({type: CREATE, user})
        return user
      })
      .catch(err => {
        throw new SubmissionError({
          _error: err && err.data ? err.data.message : 'エラーが発生しました',
          status: err && err.data ? err.data.status : null,
        })
      })
  }
}

export function show(id) {
  return (dispatch, getState, client) => {
    return client
      .get(`/api/user/${id}`)
      .then(res => res.data)
      .then(user => {
        dispatch({type: SHOW, user})
        return user
      })
  }
}

export function update(id, data) {
  return (dispatch, getState, client) => {
    return client
      .put(`/api/user/${id}`, data)
      .then(res => res.data)
      .then(user => {
        dispatch({type: UPDATE, user})
        return user
      })
      .catch(err => {
        throw new SubmissionError({
          _error: err && err.data ? err.data.message : 'エラーが発生しました',
          status: err && err.data ? err.data.status : null,
        })
      })
  }
}


