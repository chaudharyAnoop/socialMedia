import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Comment {
  id: string;
  postId: string;
  user: string;
  content: string;
  createdAt: string;
}

interface CommentsState {
  comments: Comment[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  status: "idle",
  error: null,
};

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId: string) => {
    const response = await axios.get(
      `https://api.example.com/comments?postId=${postId}`
    );
    return response.data;
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ postId, content }: { postId: string; content: string }) => {
    const response = await axios.post("https://api.example.com/comments", {
      postId,
      content,
      user: "Anoop Kumar Chaudhary",
    });
    return response.data;
  }
);

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
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch comments";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      });
  },
});

export const { resetComments } = commentsSlice.actions;
export default commentsSlice.reducer;
