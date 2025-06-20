import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./navigationBarSlice";
import postReducer from "./postSlice";
import exploreReducer from "./slices/exploreSlice";
import commentReducer from "./commentSlice";
import userReducer from "./userProfile"

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    posts: postReducer,
    explore: exploreReducer,
    comments: commentReducer,
    user:userReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
