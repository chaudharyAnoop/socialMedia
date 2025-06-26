import axios from "axios";

import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

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
const headers = token
  ? {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  : {};

export const fetchComments = createAsyncThunk<Comment[], string>(
  "comments/fetchComments",
  async (postId: string, { rejectWithValue }) => {
    if (!postId) {
      return rejectWithValue("Post ID is required");
    }
    try {
      const response = await axios.get(
        `http://172.50.5.102:3008/interaction/comment/${postId}`,
        { headers }
      );
      const comments = response.data?.data?.comments;
      if (!Array.isArray(comments)) {
        return rejectWithValue("Invalid comments data received");
      }
      return comments as Comment[];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch comments"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const addComment = createAsyncThunk<
  Comment,
  { postId: string; content: string }
>("comments/addComment", async ({ postId, content }, { rejectWithValue }) => {
  if (!postId || !content) {
    return rejectWithValue("Post ID and content are required");
  }
  try {
    const response = await axios.post(
      "http://172.50.5.102:3008/interaction/comment",
      { postId, content },
      { headers }
    );
    const comment = response.data;
    if (!comment || !comment._id) {
      return rejectWithValue("Invalid comment data received");
    }
    return comment as Comment;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
    return rejectWithValue("Unexpected error occurred");
  }
});

export const likeComment = createAsyncThunk<
  { commentId: string; likes: number },
  string
>("comments/likeComment", async (commentId: string, { rejectWithValue }) => {
  if (!commentId) {
    return rejectWithValue("Comment ID is required");
  }
  try {
    const response = await axios.post(
      `http://172.50.5.102:3008/interaction/comment/like`,
      { commentId },
      { headers }
    );
    const likes = response.data?.likes;
    if (typeof likes !== "number") {
      return rejectWithValue("Invalid likes data received");
    }
    return { commentId, likes };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to like comment"
      );
    }
    return rejectWithValue("Unexpected error occurred");
  }
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
  async (
    { commentId, content, postId, parentCommentId, replyToUserId },
    { rejectWithValue }
  ) => {
    if (
      !commentId ||
      !content ||
      !postId ||
      !parentCommentId ||
      !replyToUserId
    ) {
      return rejectWithValue("All reply fields are required");
    }
    try {
      const response = await axios.post(
        `http://172.50.5.102:3008/interaction/comment`,
        { postId, content, parentCommentId, replyToUserId },
        { headers }
      );
      const reply = response.data;
      if (!reply || !reply._id) {
        return rejectWithValue("Invalid reply data received");
      }
      return { commentId, reply: reply as Comment };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add reply"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const fetchAllReplies = createAsyncThunk<Comment[], string>(
  "comments/fetchAllReplies",
  async (commentId: string, { rejectWithValue }) => {
    if (!commentId) {
      return rejectWithValue("Comment ID is required");
    }
    try {
      const response = await axios.get(
        `http://172.50.5.102:3008/interaction/comment/replies/${commentId}`,
        { headers }
      );
      const replies = response.data?.data?.replies;
      if (!Array.isArray(replies)) {
        return rejectWithValue("Invalid replies data received");
      }
      return replies as Comment[];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch replies"
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
  if (!postId) {
    return rejectWithValue("Post ID is required");
  }
  try {
    const response = await axios.post(
      `http://172.50.5.102:3008/interaction/react`,
      { postId },
      { headers }
    );
    const likes = response.data?.likes;
    if (typeof likes !== "number") {
      return rejectWithValue("Invalid likes data received");
    }
    return { postId, likes };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error"
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
          state.comments = action.payload || [];
        }
      )
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch comments";
      })
      .addCase(
        addComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          if (action.payload) {
            state.comments.push(action.payload);
          }
        }
      )
      .addCase(addComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to add comment";
      })
      .addCase(
        likeComment.fulfilled,
        (
          state,
          action: PayloadAction<{ commentId: string; likes: number }>
        ) => {
          const { commentId, likes } = action.payload;
          const updateCommentLikes = (comments: Comment[]): boolean => {
            for (const comment of comments) {
              if (comment._id === commentId) {
                comment.likes = likes;
                return true;
              }
              if (comment.replies?.length) {
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
        state.error = (action.payload as string) || "Failed to like comment";
      })
      .addCase(
        replyComment.fulfilled,
        (
          state,
          action: PayloadAction<{ commentId: string; reply: Comment }>
        ) => {
          const { commentId, reply } = action.payload;
          const updateCommentReplies = (comments: Comment[]): boolean => {
            for (const comment of comments) {
              if (comment._id === commentId) {
                comment.replies = comment.replies || [];
                comment.replies.push(reply);
                return true;
              }
              if (comment.replies?.length) {
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
        state.error = (action.payload as string) || "Failed to add reply";
      })
      .addCase(fetchAllReplies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllReplies.fulfilled,
        (state, action: PayloadAction<Comment[], string, { arg: string }>) => {
          state.status = "succeeded";
          const commentId = action.meta.arg;
          const updateReplies = (comments: Comment[]): boolean => {
            for (const comment of comments) {
              if (comment._id === commentId) {
                comment.replies = action.payload || [];
                return true;
              }
              if (comment.replies?.length) {
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
        state.error = (action.payload as string) || "Failed to fetch replies";
      })
      .addCase(
        likePost.fulfilled,
        (state, action: PayloadAction<{ postId: string; likes: number }>) => {
          const { postId, likes } = action.payload;
          state.postLikes[postId] = likes;
        }
      )
      .addCase(likePost.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to like post";
      });
  },
});

export const { resetComments } = commentsSlice.actions;
export default commentsSlice.reducer;
