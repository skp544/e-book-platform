import  {configureStore, combineReducers} from '@reduxjs/toolkit'
import  authReducer from './authSlice'

const reducer = combineReducers({
    auth: authReducer
})

const store = configureStore({reducer})


export  default store