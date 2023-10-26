import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';
import googleReducer from './googleSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    google: googleReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
