import { CommentsState } from "../interfaces/comment.interface";

export const initialCommentsState: CommentsState = {
  comments: [],
  postLikes: {},
  status: "idle",
  error: null,
};
