import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const BASE_URL_USER = "http://172.50.5.102:3011";
const BASE_URL_FEED = "http://172.50.5.102:3000";
const S3_BASE_URL = "https://dummy-project-bucket.s3.ap-south-1.amazonaws.com/"; // NEW: S3 Base URL


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

interface ExploreState {
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

const initialState: ExploreState = {
  posts: [],
  page: 1,
  isLoading: false,
  hasMore: true,
  error: null,
  searchResults: { accounts: [], posts: [] },
  isSearchingLoading: false,
  accounts: [],
  selectedPost: null,
  searchQuery: "",
  recentSearches: [],
  isSearching: false,
};

const getAuthHeaders = (): HeadersInit => {
  const rawAuthData = localStorage.getItem("instagram_user");
  let token: string | null = null;

  if (rawAuthData) {
    try {
      token = rawAuthData.startsWith('"') && rawAuthData.endsWith('"')
        ? rawAuthData.slice(1, -1)
        : rawAuthData;
      console.log("Retrieved token:", token);
    } catch (e) {
      console.error("Failed to process auth data from localStorage:", e);
    }
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Custom-Header": "CustomValue",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("No valid token found in localStorage for authentication.");
  }

  return headers;
};


export const fetchSearchResults = createAsyncThunk(
  "explore/fetchSearchResults",
  async (query: string, { rejectWithValue }) => {
    const headers = getAuthHeaders();

    try {
      const [userRes, postRes] = await Promise.all([
        fetch(`${BASE_URL_USER}/users/search?query=${encodeURIComponent(query)}&page=1`, {
          headers,
        }),
        fetch(`${BASE_URL_FEED}/posts/search?q=${encodeURIComponent(query)}&page=1`, {
          headers,
        }),
      ]);

      if (!userRes.ok) {
        const errorData = await userRes.json().catch(() => ({ message: userRes.statusText }));
        console.error("User search failed:", errorData);
        return rejectWithValue(errorData.message || "Failed to fetch user search results.");
      }
      if (!postRes.ok) {
        const errorData = await postRes.json().catch(() => ({ message: postRes.statusText }));
        console.error("Post search failed:", errorData);
        return rejectWithValue(errorData.message || "Failed to fetch post search results.");
      }

      const userJson = await userRes.json();
      const postJson = await postRes.json();

      const accounts = (userJson.users || []).map((u: any): Account => ({
        id: u._id,
        username: u.username,
        fullName: u.fullName || "",
        profilePicture: u.profilePicture || `https://i.pravatar.cc/150?u=${u._id}`,
        followers: u.followersCount || 0,
        isVerified: u.emailVerified || false,
      }));

      const posts = (postJson.data || []).map((p: any): Post => ({
        id: p._id,
        content: p.content || "",
        username: p.username || `user${p.UserId || p._id}`,
        likes: p.reactionCount || 0,
        comments: p.commentCount || 0,
        isVideo: p.media && p.media.length > 0 && typeof p.media[0] === 'string' && (p.media[0].endsWith('.mp4') || p.media[0].endsWith('.mov') || p.media[0].endsWith('.webm')),
        imageUrl: p.media && p.media.length > 0 ? `${S3_BASE_URL}${p.media[0]}` : `https://picsum.photos/seed/${p._id || p.id}/500/500`,
        isLiked: false,
      }));

      return { accounts, posts };
    } catch (error: any) {
      console.error("Search fetch error:", error);
      let errorMessage = "Network error during search results fetch";
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage = "Could not connect to the server for search results. Check server status or network.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchFeedPosts = createAsyncThunk(
  "explore/fetchFeedPosts",
  async (page: number = 5, { rejectWithValue }) => {
    if (!Number.isInteger(page) || page < 1) {
      console.error(`Invalid page value: ${page}`);
      return rejectWithValue("Invalid page number: Page must be a positive integer.");
    }

    const headers = getAuthHeaders();
    if (!headers.Authorization) {
      return rejectWithValue("No authentication token provided. Please log in.");
    }

    try {
      console.log(`Fetching feed posts for page ${page} with headers:`, headers);
      const res = await fetch(`${BASE_URL_FEED}/posts/explore?page=${page}`, {
        headers,
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { message: res.statusText };
        }
        console.error(`Feed fetch failed with status ${res.status}:`, {
          status: res.status,
          statusText: res.statusText,
          errorData,
          headers: Object.fromEntries(res.headers.entries()),
        });
        let errorMessage = errorData.message || `Server error: ${res.status}`;
        if (res.status === 500) {
          errorMessage = "Internal server error occurred. Please check server logs for details.";
        } else if (errorData.code === 2 && errorData.codeName === "BadValue") {
          errorMessage = "Invalid query parameter sent to the server. Check page number or request format.";
        }
        return rejectWithValue(errorMessage);
      }

      const data = await res.json();
      console.log("Feed response data:", data);

      if (data && Array.isArray(data.data)) {
        return data.data.map((p: any): Post => ({
          id: p._id,
          content: p.content || "",
          username: p.username || `user${p.UserId || p._id}`,
          likes: p.reactionCount || 0,
          comments: p.commentCount || 0,
          isVideo: p.media && p.media.length > 0 && typeof p.media[0] === 'string' && (p.media[0].endsWith('.mp4') || p.media[0].endsWith('.mov') || p.media[0].endsWith('.webm')),
          // CORRECTED LINE: Prepend S3_BASE_URL
          imageUrl: p.media && p.media.length > 0 ? `${S3_BASE_URL}${p.media[0]}` : `https://picsum.photos/seed/${p._id}/500/500`,
          isLiked: false,
        }));
      } else {
        return rejectWithValue("Server responded with an unexpected feed data format.");
      }
    } catch (error: any) {
      console.error("Fetch feed posts error:", error);
      let errorMessage = "Network error during feed posts fetch";
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage = "Could not connect to the feed server. Check server status or network.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    selectPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedPost = action.payload;
    },
    likePost: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const toggleLike = (posts: Post[]) => {
        const post = posts.find((p) => p.id === id);
        if (post) {
          post.isLiked = !post.isLiked;
          post.likes += post.isLiked ? 1 : -1;
        }
      };
      toggleLike(state.posts);
      toggleLike(state.searchResults.posts);
      if (state.selectedPost?.id === id) {
        state.selectedPost.isLiked = !state.selectedPost.isLiked;
        state.selectedPost.likes += state.selectedPost.isLiked ? 1 : -1;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.isSearching = action.payload.trim().length > 0;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const term = action.payload.trim();
      if (term && !state.recentSearches.includes(term)) {
        state.recentSearches.unshift(term);
        state.recentSearches = state.recentSearches.slice(0, 10);
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter((s) => s !== action.payload);
    },
    resetExplore: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
      state.searchResults = { accounts: [], posts: [] };
      state.isSearching = false;
      state.searchQuery = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedPosts.fulfilled, (state, action) => {
        state.posts.push(...action.payload);
        state.page += 1;
        state.isLoading = false;
        state.hasMore = action.payload.length > 0;
        state.error = null;
      })
      .addCase(fetchFeedPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || "An unknown error occurred.";
        console.error("Failed to fetch feed posts:", state.error);
      })
      .addCase(fetchSearchResults.pending, (state) => {
        state.isSearchingLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.isSearchingLoading = false;
        state.error = null;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.isSearchingLoading = false;
        state.error = (action.payload as string) || action.error.message || "An unknown error occurred during search.";
        console.error("Failed to fetch search results:", state.error);
      });
  },
});

export const {
  selectPost,
  likePost,
  setSearchQuery,
  addRecentSearch,
  clearRecentSearches,
  removeRecentSearch,
  resetExplore,
} = exploreSlice.actions;

export default exploreSlice.reducer;