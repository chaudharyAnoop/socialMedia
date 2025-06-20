
import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./navigationBarSlice";
import postReducer from "./postSlice";
import exploreReducer from "./slices/exploreSlice";
import commentReducer from "./commentSlice";
import userSearchReducer, { UserSearchState } from "./UserProfile";
import userReducer from "./GetUser";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    posts: postReducer,
    explore: exploreReducer,
    comments: commentReducer,
    userSearch: userSearchReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
