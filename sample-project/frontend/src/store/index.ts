import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import usersReducer from './usersSlice'

// `theme` is shared by the whole app; `users` is only the style guide's demo data (/styleguide/examples).
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    users: usersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
