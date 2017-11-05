import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import user from 'reducer/user'

export default combineReducers({
  routing: routerReducer,
  user
})