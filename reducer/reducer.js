import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import landing from './landing'
import user from './user'

export default combineReducers({
  form: formReducer,
  landing,
  user,
})