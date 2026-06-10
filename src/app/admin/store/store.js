import { configureStore } from '@reduxjs/toolkit'

import pageTitleReducer from './pageTitleSlice'
import userReducer from './userSlice'
import adminReducer from './adminSlice'

export const store = configureStore({
  reducer: {
    pageTitle: pageTitleReducer,
    user: userReducer,
    admin: adminReducer,
  },
})