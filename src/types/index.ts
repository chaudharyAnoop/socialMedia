// src/types/index.ts - Clean Type Definitions

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  profileImage: string;
  bio: string;
  website?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  isPrivate: boolean;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  aspectRatio: number;
  alt?: string;
}

export interface Post {
  id: string;
  imageUrl?: string;
  caption?: string;
  location?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isVideo?: boolean;
  videoDuration?: number;
  isCarousel?: boolean;
  media?: MediaItem[];
  currentSlide?: number;
  tagged?: string[];
}

export interface Comment {
  id: string;
  username: string;
  profileImage: string;
  text: string;
  timestamp: Date;
  likes: number;
  replies?: Comment[];
}

export interface Story {
  id: string;
  username: string;
  profileImage: string;
  imageUrl: string;
  timestamp: Date;
  isViewed: boolean;
  isOwn?: boolean;
  isVideo?: boolean;
  title?: string;
}

export interface Highlight {
  id: string;
  title: string;
  coverImage: string;
  storiesCount: number;
  stories: Story[];
}

// Simplified - only posts tab needed
export type TabType = 'posts';

// API Response types for future backend integration
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface UserApiResponse extends ApiResponse<UserProfile> {}
export interface PostsApiResponse extends ApiResponse<Post[]> {}
export interface CommentsApiResponse extends ApiResponse<Comment[]> {}