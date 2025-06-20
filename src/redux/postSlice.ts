import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

interface Post {
  _id: number;
  UserId: string;
  username: string;
  commentCount: number;
  reactionCount: number;
  content: string;
  tags: string[];
  media: string[];
  reactions: number;
  isLiked: boolean;
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
    const token = localStorage.getItem("instagram_user");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Custom-Header": "CustomValue",
    };
    console.log(token);
    const response = await axios.get<{
      data: Post[];
      total: number;
      skip: number;
      limit: number;
    }>(
      `http://172.50.5.102:3000/posts/feed?limit=${limit}&skip=${
        (page - 1) * limit
      }`,
      { headers }
    );
    return { posts: response.data.data, total: response.data.total };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

export const likePost = createAsyncThunk<
  { postId: number; reactions: number },
  number,
  { rejectValue: string }
>("posts/likePost", async (postId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("instagram_user");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    console.log(token);
    const response = await axios.post(
      `http://172.50.5.102:3000/posts/${postId}/like`,
      { userId: "Anoop Kumar Chaudhary" },
      { headers }
    );
    return { postId, reactions: response.data.reactions };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to like post");
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
      .addCase(
        fetchPosts.fulfilled,
        (state, action: PayloadAction<{ posts: Post[]; total: number }>) => {
          state.status = "succeeded";
          state.posts = [...state.posts, ...action.payload.posts];
          state.page += 1;
          state.hasMore =
            state.posts.length < action.payload.total &&
            action.payload.posts.length > 0;
        }
      )
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch posts";
      })
      .addCase(
        likePost.fulfilled,
        (
          state,
          action: PayloadAction<{ postId: number; reactions: number }>
        ) => {
          const { postId, reactions } = action.payload;
          const post = state.posts.find((p) => p._id === postId);
          if (post) {
            post.reactions = reactions;
          }
        }
      )
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload || "Failed to like post";
      });
  },
});

export const { resetPosts } = postsSlice.actions;
export default postsSlice.reducer;
