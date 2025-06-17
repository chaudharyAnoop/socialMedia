

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Post, UserProfile, Comment, Story, Highlight } from '../types';
import { mockPosts, mockProfile, mockStories, mockHighlights } from '../data/mockData';

// Extended types for dynamic features
interface AppState {
  // Core data
  currentUser: UserProfile;
  posts: Post[];
  stories: Story[];
  highlights: Highlight[];
  
  // User interactions
  likedPosts: Set<string>;
  savedPosts: Set<string>;
  followedUsers: Set<string>;
  
  // Comments data
  comments: Record<string, Comment[]>;
  
  // UI state
  isLoading: boolean;
  selectedPost: Post | null;
  
  // Collections
  collections: Collection[];
}

interface Collection {
  id: string;
  name: string;
  posts: string[];
  coverImage?: string;
  createdAt: Date;
}

// Action types for state management
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SELECTED_POST'; payload: Post | null }
  | { type: 'LIKE_POST'; payload: string }
  | { type: 'UNLIKE_POST'; payload: string }
  | { type: 'SAVE_POST'; payload: string }
  | { type: 'UNSAVE_POST'; payload: string }
  | { type: 'FOLLOW_USER'; payload: string }
  | { type: 'UNFOLLOW_USER'; payload: string }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'UPDATE_POST'; payload: { id: string; updates: Partial<Post> } }
  | { type: 'ADD_COMMENT'; payload: { postId: string; comment: Comment } }
  | { type: 'DELETE_COMMENT'; payload: { postId: string; commentId: string } }
  | { type: 'LIKE_COMMENT'; payload: { postId: string; commentId: string } }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'ADD_STORY'; payload: Story }
  | { type: 'CREATE_COLLECTION'; payload: Collection }
  | { type: 'ADD_TO_COLLECTION'; payload: { collectionId: string; postId: string } }
  | { type: 'RESTORE_STATE'; payload: Partial<AppState> };

// Local storage utilities
const STORAGE_KEY = 'instagram_clone_state';

const saveToStorage = (state: AppState) => {
  try {
    const safeDateToString = (date: any): string => {
      if (!date) return new Date().toISOString();
      
      if (date instanceof Date) {
        // Check if it's a valid date
        if (isNaN(date.getTime())) {
          return new Date().toISOString();
        }
        return date.toISOString();
      }
      
      // If it's already a string, try to validate it
      if (typeof date === 'string') {
        const testDate = new Date(date);
        if (isNaN(testDate.getTime())) {
          return new Date().toISOString();
        }
        return testDate.toISOString();
      }
      
      // Fallback to current date
      return new Date().toISOString();
    };

    const serializedState = {
      currentUser: state.currentUser,
      posts: state.posts.map(post => ({
        ...post,
        timestamp: safeDateToString(post.timestamp)
      })),
      stories: state.stories,
      highlights: state.highlights,
      likedPosts: Array.from(state.likedPosts),
      savedPosts: Array.from(state.savedPosts),
      followedUsers: Array.from(state.followedUsers),
      comments: Object.fromEntries(
        Object.entries(state.comments).map(([key, comments]) => [
          key,
          comments.map(comment => ({
            ...comment,
            timestamp: safeDateToString(comment.timestamp)
          }))
        ])
      ),
      collections: state.collections,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedState));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

const loadFromStorage = (): Partial<AppState> | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    const safeStringToDate = (dateStr: any): Date => {
      if (!dateStr) return new Date();
      
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return new Date();
      }
      return date;
    };
    
    return {
      ...parsed,
      posts: parsed.posts?.map((post: any) => ({
        ...post,
        timestamp: safeStringToDate(post.timestamp)
      })) || [],
      comments: Object.fromEntries(
        Object.entries(parsed.comments || {}).map(([key, comments]: [string, any]) => [
          key,
          comments.map((comment: any) => ({
            ...comment,
            timestamp: safeStringToDate(comment.timestamp)
          }))
        ])
      ),
      likedPosts: new Set(parsed.likedPosts || []),
      savedPosts: new Set(parsed.savedPosts || []),
      followedUsers: new Set(parsed.followedUsers || []),
    };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return null;
  }
};

// Initial state
const initialState: AppState = {
  currentUser: mockProfile,
  posts: mockPosts,
  stories: mockStories,
  highlights: mockHighlights,
  likedPosts: new Set(),
  savedPosts: new Set(),
  followedUsers: new Set(),
  comments: {},
  isLoading: false,
  selectedPost: null,
  collections: [
    {
      id: 'default',
      name: 'All Posts',
      posts: [],
      createdAt: new Date(),
    }
  ],
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_SELECTED_POST':
      return { ...state, selectedPost: action.payload };

    case 'LIKE_POST': {
      const newLikedPosts = new Set(state.likedPosts);
      newLikedPosts.add(action.payload);
      
      const updatedPosts = state.posts.map(post =>
        post.id === action.payload
          ? { ...post, likes: post.likes + 1 }
          : post
      );

      return {
        ...state,
        likedPosts: newLikedPosts,
        posts: updatedPosts,
      };
    }

    case 'UNLIKE_POST': {
      const newLikedPosts = new Set(state.likedPosts);
      newLikedPosts.delete(action.payload);
      
      const updatedPosts = state.posts.map(post =>
        post.id === action.payload
          ? { ...post, likes: Math.max(0, post.likes - 1) }
          : post
      );

      return {
        ...state,
        likedPosts: newLikedPosts,
        posts: updatedPosts,
      };
    }

    case 'SAVE_POST': {
      const newSavedPosts = new Set(state.savedPosts);
      newSavedPosts.add(action.payload);
      return { ...state, savedPosts: newSavedPosts };
    }

    case 'UNSAVE_POST': {
      const newSavedPosts = new Set(state.savedPosts);
      newSavedPosts.delete(action.payload);
      return { ...state, savedPosts: newSavedPosts };
    }

    case 'ADD_POST': {
      const newPost = {
        ...action.payload,
        id: `post_${Date.now()}`,
        timestamp: new Date(), // FIXED: Ensure it's always a Date object
        likes: action.payload.likes || 0,
        comments: action.payload.comments || 0,
      };

      const updatedUser = {
        ...state.currentUser,
        postsCount: state.currentUser.postsCount + 1,
      };

      return {
        ...state,
        posts: [newPost, ...state.posts],
        currentUser: updatedUser,
      };
    }

    case 'UPDATE_POST': {
      const updatedPosts = state.posts.map(post =>
        post.id === action.payload.id
          ? { ...post, ...action.payload.updates }
          : post
      );

      return { ...state, posts: updatedPosts };
    }

    case 'ADD_COMMENT': {
      const { postId, comment } = action.payload;
      const newComment = {
        ...comment,
        id: `comment_${Date.now()}`,
        timestamp: new Date(), // FIXED: Ensure it's always a Date object
        likes: comment.likes || 0,
      };

      const updatedComments = {
        ...state.comments,
        [postId]: [...(state.comments[postId] || []), newComment],
      };

      const updatedPosts = state.posts.map(post =>
        post.id === postId
          ? { ...post, comments: post.comments + 1 }
          : post
      );

      return {
        ...state,
        comments: updatedComments,
        posts: updatedPosts,
      };
    }

    case 'UPDATE_PROFILE':
      return {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload },
      };

    case 'RESTORE_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

// Context creation
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = loadFromStorage();
    if (savedState) {
      dispatch({ type: 'RESTORE_STATE', payload: savedState });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Custom hooks for specific features
export const usePosts = () => {
  const { state, dispatch } = useApp();
  
  return {
    posts: state.posts,
    likedPosts: state.likedPosts,
    savedPosts: state.savedPosts,
    
    likePost: (postId: string) => {
      dispatch({ type: 'LIKE_POST', payload: postId });
    },
    
    unlikePost: (postId: string) => {
      dispatch({ type: 'UNLIKE_POST', payload: postId });
    },
    
    savePost: (postId: string) => {
      dispatch({ type: 'SAVE_POST', payload: postId });
    },
    
    unsavePost: (postId: string) => {
      dispatch({ type: 'UNSAVE_POST', payload: postId });
    },
    
    addPost: (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments'>) => {
      dispatch({ type: 'ADD_POST', payload: post as Post });
    },
    
    updatePost: (id: string, updates: Partial<Post>) => {
      dispatch({ type: 'UPDATE_POST', payload: { id, updates } });
    },
  };
};

export const useProfile = () => {
  const { state, dispatch } = useApp();
  
  return {
    currentUser: state.currentUser,
    followedUsers: state.followedUsers,
    
    updateProfile: (updates: Partial<UserProfile>) => {
      dispatch({ type: 'UPDATE_PROFILE', payload: updates });
    },
  };
};

export const useComments = () => {
  const { state, dispatch } = useApp();
  
  return {
    comments: state.comments,
    
    addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp' | 'likes'>) => {
      dispatch({ type: 'ADD_COMMENT', payload: { postId, comment: comment as Comment } });
    },
  };
};