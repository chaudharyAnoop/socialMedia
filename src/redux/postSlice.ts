import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { fetchPostsApi, likePostApi } from "../service/postSliceApi";
import { Post, PostsState } from "../interfaces/posts.interface";

const initialState: PostsState = {
  posts: [],
  status: "idle",
  error: null,
  page: 1,
  limit: 10,
  hasMore: true,
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const { posts, total } = await fetchPostsApi(page, limit);
      return { posts, total };
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Failed to fetch posts");
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId: number, { rejectWithValue }) => {
    try {
      return await likePostApi(postId);
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Failed to like post");
    }
  }
);

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
          state.posts = [...state.posts, ...(action.payload.posts || [])];
          state.page += 1;
          state.hasMore =
            state.posts.length < (action.payload.total || 0) &&
            action.payload.posts.length > 0;
        }
      )
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
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
            post.isLiked = true;
          }
        }
      )
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetPosts } = postsSlice.actions;
export default postsSlice.reducer;
