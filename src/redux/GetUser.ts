import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  accountType: string;
  profilePicture?: string;
  followersCount: number;
  followingCount: number;
  followers: string[];
  following: string[];
  posts: any[];
  blockedUsers: string[];
  isBanned: boolean;
  isActive: boolean;
  status: string;
  emailVerified: boolean;
  sessions: any[];
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  pendingFollowRequests: any[];
  banReason?: string | null;
}

import { StatusEnum } from "../enums/StatusEnum";

interface UserState {
  user: User | null;
  status: StatusEnum;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: StatusEnum.Idle,
  error: null,
};

import { getInstagramUser } from "../constants/localStorage";

const rawToken = getInstagramUser();
const cleanedUser = rawToken?.slice(1, -1);
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${cleanedUser}`,
};

export const fetchUser = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("user/fetchUser", async (userId: string, { rejectWithValue }) => {
  try {
    const response = await fetch(`http://172.50.5.102:3011/users/${userId}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const data: User = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
      state.status = StatusEnum.Idle;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = StatusEnum.Loading;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = StatusEnum.Succeeded;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = StatusEnum.Failed;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;

export type { UserState, User };
