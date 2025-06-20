import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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

interface UserSearchResponse {
  users: User[];
  totalCount: number;
}

interface UserSearchState {
  users: User[];
  totalCount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface SearchParams {
  [key: string]: string | number | boolean;
}

const initialState: UserSearchState = {
  users: [],
  totalCount: 0,
  status: "idle",
  error: null,
};

const token = localStorage.getItem("instagram_user");
const cleanedUser = token?.slice(1, -1);
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${cleanedUser}`,
};

export const searchUsers = createAsyncThunk<
  UserSearchResponse,
  SearchParams,
  { rejectValue: string }
>(
  "userSearch/searchUsers",
  async (searchParams: SearchParams, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(
        Object.entries(searchParams).map(([key, value]) => [key, String(value)])
      ).toString();
      const response = await fetch(
        `http://172.50.5.102:3011/users/search?${query}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: UserSearchResponse = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const userSearchSlice = createSlice({
  name: "userSearch",
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.users = [];
      state.totalCount = 0;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.users;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { clearSearchResults } = userSearchSlice.actions;

export default userSearchSlice.reducer;

export type { UserSearchState, User };