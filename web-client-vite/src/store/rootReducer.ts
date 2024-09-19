import { combineReducers } from "@reduxjs/toolkit"
import authReducer from './auth/auth.slice'
import userReducer from './users/user.slice'

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
})

export default rootReducer