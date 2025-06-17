

// App.tsx - Fixed with Single CreatePost Modal (ProfileHeader manages its own)
import React, { useState } from 'react';
import { AppProvider, usePosts, useProfile as useNewProfile } from '../../contexts/AppContext';
import { ToastContainer } from '../../components/ProfilePage/common/Toast/ToastContainer';
import { SearchModal } from '../../components/ProfilePage/explore/SearchModal/SearchModal';
import { useModal } from '../../hooks/useModal';

// Your existing components
import ProfileHeader from '../../components/ProfilePage/Dashboard/Profileheader/ProfileHeader';
import UnifiedStoriesHighlights from '../../components/ProfilePage/Dashboard/UnifiedStoriesHighlights';
import TabNavigation from '../../components/ProfilePage/Dashboard/TabNavigation/Tabnavigation';
import EnhancedPostGrid from '../../components/ProfilePage/Dashboard/TabNavigation/Tabnavigation';
import PostModal from '../../components/ProfilePage/Dashboard/PostModal/PostModal';
import MobileNavigation from '../../components/ProfilePage/NavigationBar/MobileNavigation/MobileNavigation';
import StoryViewer from '../../components/ProfilePage/Dashboard/StoryViewer/StoryViewer';

// Your existing data and hooks
import { mockStories, mockHighlights, mockReels } from '../../data/mockData';
import { useProfile } from '../../hooks/useProfile';
import type { Story, UserProfile, Post } from '../../types';
import './styles/globals.css';

// App Content Component (uses hooks, must be inside provider)
const AppContent: React.FC = () => {
  // Your existing useProfile hook for UI state
  const {
    activeTab,
    setActiveTab,
    isFollowing,
    selectedPost,
    likedPosts,
    savedPosts,
    handleFollowToggle,
    handlePostClick,
    handleCloseModal,
    handleLikePost,
    handleSavePost
  } = useProfile();

  // New dynamic context hooks
  const { posts, addPost } = usePosts();
  const { currentUser, updateProfile } = useNewProfile();

  // State for story viewer (keep your existing logic)
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  
  // State for reels (you can move this to context later)
  const [reels, setReels] = useState<Post[]>(mockReels);

  // Search modal only (ProfileHeader manages CreatePost)
  const searchModal = useModal();
  

  // Your existing story functions
  const handleStoryClick = (story: Story, index: number) => {
    setCurrentStoryIndex(index);
    setShowStoryViewer(true);
  };

  const handleStoryViewerClose = () => {
    setShowStoryViewer(false);
  };

  const handleStoryChange = (index: number) => {
    setCurrentStoryIndex(index);
  };

  // Updated profile update function
  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    updateProfile(updatedProfile);
  };

  // FIXED: This handles the actual post creation from ProfileHeader
  const handleNewPost = (postData: any) => {
    addPost(postData);
  };

  // New search function
  const handleSearch = () => {
    searchModal.openModal();
  };

  // Your existing tab content logic - now uses posts from context
  const getTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <EnhancedPostGrid 
            posts={posts} 
            onPostClick={handlePostClick}
            activeTab={activeTab}
            likedPosts={likedPosts}
            onLike={handleLikePost}
          />
        );
      case 'reels':
        return (
          <EnhancedPostGrid 
            posts={reels} 
            onPostClick={handlePostClick}
            activeTab={activeTab}
            likedPosts={likedPosts}
            onLike={handleLikePost}
          />
        );
      case 'tagged':
        return (
          <EnhancedPostGrid 
            posts={[]} 
            onPostClick={handlePostClick}
            activeTab={activeTab}
            likedPosts={likedPosts}
            onLike={handleLikePost}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <div className="container">
        <MobileNavigation 
          username={currentUser.username}
          onNotifications={() => console.log('Notifications clicked')}
          onMessages={() => console.log('Messages clicked')}
          onMore={() => console.log('More clicked')} // Simplified for now
        />
        
        <ProfileHeader 
          profile={currentUser}
          isFollowing={isFollowing} 
          onFollowToggle={handleFollowToggle}
          isOwnProfile={true}
          onProfileUpdate={handleProfileUpdate}
          onNewPost={handleNewPost} // Handles post data from ProfileHeader's modal
        />
        
        

        <UnifiedStoriesHighlights
         stories={mockStories}
         highlights={mockHighlights}
         onStoryClick={handleStoryClick}
         onHighlightClick={(highlight) => console.log('Highlight clicked:', highlight)}
         onAddStory={() => console.log('Add story clicked')}
         isOwnProfile={true}
        />
        
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <div className="content">
          {getTabContent()}
        </div>
        
        {selectedPost && (
          <PostModal
            post={selectedPost}
            profile={currentUser}
            onClose={handleCloseModal}
            isLiked={likedPosts.has(selectedPost.id)}
            isSaved={savedPosts.has(selectedPost.id)}
            onLike={() => handleLikePost(selectedPost.id)}
            onSave={() => handleSavePost(selectedPost.id)}
          />
        )}

        {showStoryViewer && (
          <StoryViewer
            stories={mockStories}
            currentStoryIndex={currentStoryIndex}
            profile={currentUser}
            onClose={handleStoryViewerClose}
            onStoryChange={handleStoryChange}
          />
        )}
      </div>

      {/* Search Modal only - ProfileHeader manages its own CreatePost modal */}
      {searchModal.isOpen && (
        <SearchModal 
          onClose={searchModal.closeModal}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

// Main App Component with Provider
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;



