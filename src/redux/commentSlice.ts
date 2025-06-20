import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

export interface Comment {
  commentId: string;
  _id: string;
  postId: string;
  user: string;
  content: string;
  createdAt: string;
  likes?: number;
  replies?: Comment[];
}

export interface CommentsState {
  comments: Comment[];
  postLikes: { [postId: string]: number };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  postLikes: {},
  status: "idle",
  error: null,
};

const token = localStorage.getItem("instagram_user");
const cleanedUser = token;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${cleanedUser}`,
};

export const fetchComments = createAsyncThunk<Comment[], string>(
  "comments/fetchComments",
  async (postId: string) => {
    const response = await axios.get(
      `http://172.50.5.102:3008/interaction/comment/${postId}`,
      { headers }
    );
    return response.data.data.comments as Comment[];
  }
);

export const addComment = createAsyncThunk<
  Comment,
  { postId: string; content: string }
>("comments/addComment", async ({ postId, content }) => {
  const response = await axios.post(
    "http://172.50.5.102:3008/interaction/comment",
    { postId, content },
    { headers }
  );
  return response.data as Comment;
});

export const likeComment = createAsyncThunk<
  { commentId: string; likes: number },
  string
>("comments/likeComment", async (commentId: string) => {
  const response = await axios.post(
    `http://172.50.5.102:3008/interaction/comment/like`,
    { commentId },
    { headers }
  );
  return { commentId, likes: response.data.likes } as {
    commentId: string;
    likes: number;
  };
});

export const replyComment = createAsyncThunk<
  { commentId: string; reply: Comment },
  {
    commentId: string;
    content: string;
    postId: string;
    parentCommentId: string;
    replyToUserId: string;
  }
>(
  "comments/replyComment",
  async ({ commentId, content, postId, parentCommentId, replyToUserId }) => {
    const response = await axios.post(
      `http://172.50.5.102:3008/interaction/comment`,
      { postId, content, parentCommentId, replyToUserId },
      { headers }
    );
    return { commentId, reply: response.data as Comment };
  }
);

export const fetchAllReplies = createAsyncThunk<Comment[], string>(
  "comments/fetchAllReplies",
  async (commentId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://172.50.5.102:3008/interaction/comment/replies/${commentId}`,
        { headers }
      );
      return response.data.data.replies as Comment[];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Failed to fetch replies"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const likePost = createAsyncThunk<
  { postId: string; likes: number },
  string
>("comments/likePost", async (postId: string, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `http://172.50.5.102:3008/interaction/react`,
      { postId },
      { headers }
    );
    return { postId, likes: response.data.likes } as {
      postId: string;
      likes: number;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data || "Unauthorized or server error"
      );
    }
    return rejectWithValue("Unexpected error occurred");
  }
});

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    resetComments: (state) => {
      state.comments = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchComments.fulfilled,
        (state, action: PayloadAction<Comment[]>) => {
          state.status = "succeeded";
          state.comments = action.payload;
        }
      )
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch comments";
      })
      .addCase(
        addComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          state.comments.push(action.payload);
        }
      )
      .addCase(addComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add comment";
      })
      .addCase(
        likeComment.fulfilled,
        (
          state,
          action: PayloadAction<{ commentId: string; likes: number }>
        ) => {
          const { commentId, likes } = action.payload;
          const updateCommentLikes = (comments: Comment[]) => {
            for (const comment of comments) {
              if (comment._id === commentId) {
                comment.likes = likes;
                return true;
              }
              if (comment.replies) {
                const found = updateCommentLikes(comment.replies);
                if (found) return true;
              }
            }
            return false;
          };
          updateCommentLikes(state.comments);
        }
      )
      .addCase(likeComment.rejected, (state, action) => {
        state.error = action.error.message || "Failed to like comment";
      })

      .addCase(
        replyComment.fulfilled,
        (
          state,
          action: PayloadAction<{ commentId: string; reply: Comment }>
        ) => {
          const { commentId, reply } = action.payload;
          const updateCommentReplies = (comments: Comment[]) => {
            for (const comment of comments) {
              if (comment._id === commentId) {
                comment.replies = comment.replies || [];
                comment.replies.push(reply);
                return true;
              }
              if (comment.replies) {
                const found = updateCommentReplies(comment.replies);
                if (found) return true;
              }
            }
            return false;
          };
          updateCommentReplies(state.comments);
        }
      )
      .addCase(replyComment.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add reply";
      })
      .addCase(fetchAllReplies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllReplies.fulfilled,
        (state, action: PayloadAction<Comment[], string, { arg: string }>) => {
          state.status = "succeeded";
          const commentId = action.meta.arg;
          const updateReplies = (comments: Comment[]) => {
            for (const comment of comments) {
              if (comment._id === commentId) {
                comment.replies = action.payload;
                return true;
              }
              if (comment.replies) {
                const found = updateReplies(comment.replies);
                if (found) return true;
              }
            }
            return false;
          };
          updateReplies(state.comments);
        }
      )
      .addCase(fetchAllReplies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch replies";
      })
      .addCase(
        likePost.fulfilled,
        (state, action: PayloadAction<{ postId: string; likes: number }>) => {
          const { postId, likes } = action.payload;
          state.postLikes[postId] = likes;
        }
      )
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.error.message || "Failed to like post";
      });
  },
});

export const { resetComments } = commentsSlice.actions;
export default commentsSlice.reducer;
