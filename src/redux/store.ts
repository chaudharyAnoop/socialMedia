import { configureStore } from "@reduxjs/toolkit";

import sidebarReducer from "./navigationBarSlice";
import userReducer from "./GetUser";
import userSearchReducer from "./UserProfile";
import postReducer from "./postSlice";
import commentReducer from "./commentSlice";
import exploreReducer from "./slices/exploreSlice";

import chatReducer from "./chatSlice/chatSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    posts: postReducer,
    explore: exploreReducer,
    comments: commentReducer,
    userSearch: userSearchReducer,
    user: userReducer,
    chat: chatReducer,
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
