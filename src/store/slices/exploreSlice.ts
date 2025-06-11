import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Post {
  id: string;
  imageUrl: string;
  username: string;
  likes: number;
  comments: number;
  isVideo: boolean;
  size: 'small' | 'medium' | 'large';
}

export interface Account {
  id: string;
  username: string;
  fullName: string;
  profileImage: string;
  followers: number;
  isVerified: boolean;
}

interface ExploreState {
  posts: Post[];
  accounts: Account[];
  loading: boolean;
  selectedPost: Post | null;
  searchQuery: string;
  recentSearches: string[];
  searchResults: {
    accounts: Account[];
    posts: Post[];
  };
  isSearching: boolean;
}

const mockPosts: Post[] = [
  {
    id: '1',
    imageUrl: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
    username: 'naturelover',
    likes: 1234,
    comments: 89,
    isVideo: false,
    size: 'large'
  },
  {
    id: '2',
    imageUrl: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=600',
    username: 'urbanexplorer',
    likes: 856,
    comments: 23,
    isVideo: false,
    size: 'small'
  },
  {
    id: '3',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    username: 'foodie_adventures',
    likes: 2341,
    comments: 156,
    isVideo: true,
    size: 'medium'
  },
  {
    id: '4',
    imageUrl: 'https://images.pexels.com/photos/1771383/pexels-photo-1771383.jpeg?auto=compress&cs=tinysrgb&w=600',
    username: 'artistic_soul',
    likes: 567,
    comments: 34,
    isVideo: false,
    size: 'small'
  },
  {
    id: '5',
    imageUrl: 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=600',
    username: 'adventure_seeker',
    likes: 3456,
    comments: 278,
    isVideo: false,
    size: 'large'
  },
  {
    id: '6',
    imageUrl: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=600',
    username: 'lifestyle_blogger',
    likes: 1876,
    comments: 92,
    isVideo: false,
    size: 'medium'
  },
  {
    id: '7',
    imageUrl: 'https://images.pexels.com/photos/1462935/pexels-photo-1462935.jpeg?auto=compress&cs=tinysrgb&w=600',
    username: 'pet_lover',
    likes: 4321,
    comments: 345,
    isVideo: true,
    size: 'small'
  },
  {
    id: '8',
    imageUrl: 'https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg?auto=compress&cs=tinysrgb&w=600',
    username: 'fitness_guru',
    likes: 987,
    comments: 76,
    isVideo: false,
    size: 'medium'
  },
  {
    id: '9',
    imageUrl: 'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=600',
    username: 'travel_diaries',
    likes: 2876,
    comments: 198,
    isVideo: false,
    size: 'large'
  },
  {
    id: '10',
    imageUrl: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=600',
    username: 'music_vibes',
    likes: 1543,
    comments: 87,
    isVideo: true,
    size: 'small'
  },
  {
    id: '11',
    imageUrl: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=600',
    username: 'fashion_forward',
    likes: 5432,
    comments: 432,
    isVideo: false,
    size: 'medium'
  },
  {
    id: '12',
    imageUrl: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=600',
    username: 'architecture_fan',
    likes: 876,
    comments: 45,
    isVideo: false,
    size: 'small'
  }
];

const mockAccounts: Account[] = [
  {
    id: '1',
    username: 'naturelover',
    fullName: 'Nature Photography',
    profileImage: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100',
    followers: 125000,
    isVerified: true
  },
  {
    id: '2',
    username: 'urbanexplorer',
    fullName: 'Urban Explorer',
    profileImage: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=100',
    followers: 89000,
    isVerified: false
  },
  {
    id: '3',
    username: 'foodie_adventures',
    fullName: 'Foodie Adventures',
    profileImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100',
    followers: 234000,
    isVerified: true
  },
  {
    id: '4',
    username: 'artistic_soul',
    fullName: 'Artistic Soul',
    profileImage: 'https://images.pexels.com/photos/1771383/pexels-photo-1771383.jpeg?auto=compress&cs=tinysrgb&w=100',
    followers: 56000,
    isVerified: false
  },
  {
    id: '5',
    username: 'adventure_seeker',
    fullName: 'Adventure Seeker',
    profileImage: 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=100',
    followers: 345000,
    isVerified: true
  },
  {
    id: '6',
    username: 'lifestyle_blogger',
    fullName: 'Lifestyle Blogger',
    profileImage: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=100',
    followers: 187000,
    isVerified: false
  }
];

const initialState: ExploreState = {
  posts: mockPosts,
  accounts: mockAccounts,
  loading: false,
  selectedPost: null,
  searchQuery: '',
  recentSearches: ['nature', 'food', 'travel', 'art', 'fitness'],
  searchResults: {
    accounts: [],
    posts: []
  },
  isSearching: false,
};

const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    selectPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedPost = action.payload;
    },
    likePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.likes += 1;
      }
      // Also update in search results if present
      const searchPost = state.searchResults.posts.find(p => p.id === action.payload);
      if (searchPost) {
        searchPost.likes += 1;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.isSearching = action.payload.length > 0;
      
      if (action.payload.length > 0) {
        // Filter accounts and posts based on search query
        const query = action.payload.toLowerCase();
        
        state.searchResults.accounts = state.accounts.filter(
          account => 
            account.username.toLowerCase().includes(query) ||
            account.fullName.toLowerCase().includes(query)
        );
        
        state.searchResults.posts = state.posts.filter(
          post => post.username.toLowerCase().includes(query)
        );
      } else {
        state.searchResults.accounts = [];
        state.searchResults.posts = [];
      }
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const search = action.payload.trim();
      if (search && !state.recentSearches.includes(search)) {
        state.recentSearches.unshift(search);
        // Keep only last 10 searches
        if (state.recentSearches.length > 10) {
          state.recentSearches = state.recentSearches.slice(0, 10);
        }
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(
        search => search !== action.payload
      );
    },
  },
});

export const { 
  setLoading, 
  selectPost, 
  likePost, 
  setSearchQuery, 
  addRecentSearch, 
  clearRecentSearches, 
  removeRecentSearch 
} = exploreSlice.actions;
export default exploreSlice.reducer;