import { configureStore } from '@reduxjs/toolkit'
import mortgageReducer from './mortgageSlice'

const store = configureStore({
  reducer: {
    mortgage: mortgageReducer,
  },
})

export default store 