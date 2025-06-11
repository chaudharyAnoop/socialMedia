import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./navigationBarSlice";
import postReducer from "./postSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    posts: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
