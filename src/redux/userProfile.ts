// redux/userProfile.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the User interface based on the provided API response
interface User {
  _id: string;
  username: string;
  email: string;
  accountType: string;
  followersCount: number;
  followingCount: number;
  followers: string[];
  following: string[];
  posts: string[];
  blockedUsers: string[];
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  emailVerified: boolean;
  isActive: boolean;
  isPrivate: boolean;
  pendingFollowRequests: string[];
  sessions: string[];
  status: string;
}

// Define the state for the user slice
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};
let token = localStorage.getItem("instagram_user");
let cleanedUser = token?.slice(1, -1);
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${cleanedUser}`,
};
export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://172.50.5.102:3011/users/profile',{headers});
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch user data');
    }
  }
);

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user data';
      });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;