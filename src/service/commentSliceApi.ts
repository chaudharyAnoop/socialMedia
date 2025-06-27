import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    resetComments: (state) => {
      state.comments = [];
      state.status = "idle";
      state.error = null;
    },
    setComments: (state, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    },
    updateCommentLikes: (
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
    },
    addReply: (
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
    },
    setReplies: (
      state,
      action: PayloadAction<{ commentId: string; replies: Comment[] }>
    ) => {
      const { commentId, replies } = action.payload;
      const updateReplies = (comments: Comment[]): boolean => {
        for (const comment of comments) {
          if (comment._id === commentId) {
            comment.replies = replies;
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
    },
    updatePostLikes: (
      state,
      action: PayloadAction<{ postId: string; likes: number }>
    ) => {
      const { postId, likes } = action.payload;
      state.postLikes[postId] = likes;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
    setLoading: (state) => {
      state.status = "loading";
    },
  },
});

export const {
  resetComments,
  setComments,
  addComment,
  updateCommentLikes,
  addReply,
  setReplies,
  updatePostLikes,
  setError,
  setLoading,
} = commentsSlice.actions;
export default commentsSlice.reducer;
