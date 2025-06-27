export interface Post {
  id: string;
  imageUrl: string;
  content?: string;
  username: string;
  likes: number;
  comments: number;
  isVideo: boolean;
  isLiked?: boolean;
}

export interface Account {
  id: string;
  username: string;
  fullName: string;
  profilePicture: string;
  followers: number;
  isVerified: boolean;
}

export interface ExploreState {
  posts: Post[];
  page: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  searchResults: {
    accounts: Account[];
    posts: Post[];
  };
  isSearchingLoading: boolean;
  accounts: Account[];
  selectedPost: Post | null;
  searchQuery: string;
  recentSearches: string[];
  isSearching: boolean;
}
