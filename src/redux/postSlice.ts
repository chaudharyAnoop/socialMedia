import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: number;
}

interface PostsState {
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  hasMore: boolean;
  limit: number;
}

const initialState: PostsState = {
  posts: [],
  status: "idle",
  error: null,
  page: 1,
  limit: 10,
  hasMore: true,
};

export const fetchPosts = createAsyncThunk<
  { posts: Post[]; total: number },
  { page: number; limit: number },
  { rejectValue: string }
>("posts/fetchPosts", async ({ page, limit }, { rejectWithValue }) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODRiZDc2NDdmZDcyMzVjNjViYmM2NmEiLCJlbWFpbCI6ImpvaG4xMkB5b3BtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiZGV2aWNlSWQiOiJ0ZXN0LWRldmljZSIsImlwQWRkcmVzcyI6IjEyNy4wLjAuMSIsInVzZXJBZ2VudCI6IlBvc3RtYW5SdW50aW1lLzcuMjkuMCIsImlhdCI6MTc0OTgwMDg4OSwiZXhwIjoxNzQ5ODAzODg5LCJzdWIiOiI2ODRiZDc2NDdmZDcyMzVjNjViYmM2NmEifQ.RsdUo5jv12A8ViBE1wOx51On4CrnQiFoyfWKuHhZuHg`,
      "X-Custom-Header": "CustomValue",
    };
    const response = await axios.get<{
      posts: Post[];
      total: number;
      skip: number;
      limit: number;
    }>(
      `http://localhost:3000/posts/feed?limit=${limit}&skip=${
        (page - 1) * limit
      }`,
      { headers }
    );
    return { posts: response.data.posts, total: response.data.total };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    resetPosts: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = [...state.posts, ...action.payload.posts];
        state.page += 1;
        state.hasMore =
          state.posts.length < action.payload.total &&
          action.payload.posts.length > 0;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch posts";
      });
  },
});

export const { resetPosts } = postsSlice.actions;
export default postsSlice.reducer;
