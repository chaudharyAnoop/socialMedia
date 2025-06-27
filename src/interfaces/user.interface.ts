export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  accountType: string;
  profilePicture?: string;
  followersCount: number;
  followingCount: number;
  followers: string[];
  following: string[];
  posts: any[];
  blockedUsers: string[];
  isBanned: boolean;
  isActive: boolean;
  status: string;
  emailVerified: boolean;
  sessions: any[];
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  pendingFollowRequests: any[];
  banReason?: string | null;
}

export interface UserSearchResponse {
  users: User[];
  totalCount: number;
}

export interface UserSearchState {
  users: User[];
  totalCount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface SearchParams {
  [key: string]: string | number | boolean;
}
