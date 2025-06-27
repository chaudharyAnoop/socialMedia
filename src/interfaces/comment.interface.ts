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
