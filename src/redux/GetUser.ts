import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define interfaces (reusing User from userSearchSlice)
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

interface UserState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
};

// Token setup
let token = localStorage.getItem("instagram_user");
let cleanedUser = token?.slice(1, -1);
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${cleanedUser}`,
};

// Async thunk to fetch a single user
export const fetchUser = createAsyncThunk<
  User, // Return type
  string, // Argument type (userId)
  { rejectValue: string } // ThunkAPI config
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
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });
  },
});

// Export actions
export const { clearUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// Export state type for use in selectors
export type { UserState, User };
