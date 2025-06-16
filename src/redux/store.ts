import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./navigationBarSlice";
import postReducer from "./postSlice";
import exploreReducer from "./slices/exploreSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    posts: postReducer,
    explore: exploreReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
