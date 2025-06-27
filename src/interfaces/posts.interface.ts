export interface CircularImageProps {
  imgUrl: string;
  alt?: string;
  body: string;
  title: string;
  likecount: string;
  postId: string;
  isLiked: boolean;
}

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

export interface Post {
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

export interface PostsState {
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  hasMore: boolean;
  limit: number;
}
