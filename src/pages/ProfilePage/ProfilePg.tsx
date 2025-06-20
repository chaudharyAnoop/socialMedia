



// // App.tsx - Complete Fixed and Clean Version
// import React, { useState } from 'react';
// import { AppProvider, usePosts, useProfile as useNewProfile } from '../../contexts/AppContext';
// import { ToastContainer } from '../../components/ProfilePage/common/Toast/ToastContainer';
// import { SearchModal } from '../../components/ProfilePage/explore/SearchModal/SearchModal';
// import { useModal } from '../../hooks/useModal';

// // Components
// import ProfileHeader from '../../components/ProfilePage/Dashboard/Profileheader/ProfileHeader';
// import TabNavigation from '../../components/ProfilePage/Dashboard/TabNavigation/Tabnavigation';
// import EnhancedPostGrid from '../../components/ProfilePage/Dashboard/PostGrid/EnhancedPostGrid';
// import PostModal from '../../components/ProfilePage/Dashboard/PostModal/PostModal';
// import MobileNavigation from '../../components/ProfilePage/NavigationBar/MobileNavigation/MobileNavigation';

// // Data and hooks
// import { mockReels } from '../../data/mockData';
// import { useProfile } from '../../hooks/useProfile';
// import type { UserProfile, Post } from '../../types';
// import '../../styles/globals.css';

// // Error Boundary Component
// class ErrorBoundary extends React.Component<
//   { children: React.ReactNode },
//   { hasError: boolean }
// > {
//   constructor(props: { children: React.ReactNode }) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(_: Error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error('App Error:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div style={{ 
//           padding: '20px', 
//           textAlign: 'center',
//           minHeight: '100vh',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           flexDirection: 'column'
//         }}>
//           <h2>Something went wrong.</h2>
//           <button 
//             onClick={() => window.location.reload()}
//             style={{
//               padding: '10px 20px',
//               marginTop: '10px',
//               border: 'none',
//               borderRadius: '5px',
//               backgroundColor: '#007bff',
//               color: 'white',
//               cursor: 'pointer'
//             }}
//           >
//             Reload Page
//           </button>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// // Loading Component
// const LoadingScreen: React.FC = () => (
//   <div className="app">
//     <div className="container">
//       <div style={{ 
//         padding: '20px', 
//         textAlign: 'center',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '50vh'
//       }}>
//         <div>Loading profile...</div>
//       </div>
//     </div>
//   </div>
// );

// // App Content Component (uses hooks, must be inside provider)
// const AppContent: React.FC = () => {
//   // Local UI state hook
//   const {
//     activeTab,
//     setActiveTab,
//     isFollowing,
//     selectedPost,
//     likedPosts,
//     savedPosts,
//     handleFollowToggle,
//     handlePostClick,
//     handleCloseModal,
//     handleLikePost,
//     handleSavePost
//   } = useProfile();

//   // Context hooks
//   const { posts, addPost } = usePosts();
//   const { currentUser, updateProfile } = useNewProfile();

//   // Local state
//   const [reels, setReels] = useState<Post[]>(mockReels);
//   const searchModal = useModal();

//   // Event handlers
//   const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
//     updateProfile(updatedProfile);
//   };

//   const handleNewPost = (postData: Omit<Post, 'id' | 'createdAt'>) => {
//     addPost(postData);
//   };

//   const handleSearch = () => {
//     searchModal.openModal();
//   };

//   const handleNotifications = () => {
//     // TODO: Implement notifications functionality
//     console.log('Notifications clicked');
//   };

//   const handleMessages = () => {
//     // TODO: Implement messages functionality
//     console.log('Messages clicked');
//   };

//   const handleMore = () => {
//     // TODO: Implement more menu functionality
//     console.log('More clicked');
//   };

//   // Tab content logic
//   const getTabContent = () => {
//     switch (activeTab) {
//       case 'posts':
//         return (
//           <EnhancedPostGrid 
//             posts={posts || []}
//             onPostClick={handlePostClick}
//             activeTab={activeTab}
//             likedPosts={likedPosts}
//             onLike={handleLikePost}
//           />
//         );
//       case 'reels':
//         return (
//           <EnhancedPostGrid 
//             posts={reels} 
//             onPostClick={handlePostClick}
//             activeTab={activeTab}
//             likedPosts={likedPosts}
//             onLike={handleLikePost}
//           />
//         );
//       case 'tagged':
//         return (
//           <EnhancedPostGrid 
//             posts={[]} 
//             onPostClick={handlePostClick}
//             activeTab={activeTab}
//             likedPosts={likedPosts}
//             onLike={handleLikePost}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   // Show loading if currentUser is not available
//   if (!currentUser) {
//     return <LoadingScreen />;
//   }

//   return (
//     <div className="app">
//       <div className="container">
//         <MobileNavigation 
//           username={currentUser.username}
//           onNotifications={handleNotifications}
//           onMessages={handleMessages}
//           onMore={handleMore}
//         />
        
//         <ProfileHeader 
//           profile={currentUser}
//           isFollowing={isFollowing} 
//           onFollowToggle={handleFollowToggle}
//           isOwnProfile={true}
//           onProfileUpdate={handleProfileUpdate}
//           onNewPost={handleNewPost}
//         />
        
//         <TabNavigation 
//           activeTab={activeTab} 
//           onTabChange={setActiveTab} 
//         />
        
//         <div className="content">
//           {getTabContent()}
//         </div>
        
//         {selectedPost && (
//           <PostModal
//             post={selectedPost}
//             profile={currentUser}
//             onClose={handleCloseModal}
//             isLiked={likedPosts.has(selectedPost.id)}
//             isSaved={savedPosts.has(selectedPost.id)}
//             onLike={() => handleLikePost(selectedPost.id)}
//             onSave={() => handleSavePost(selectedPost.id)}
//           />
//         )}
//       </div>

//       {searchModal.isOpen && (
//         <SearchModal 
//           onClose={searchModal.closeModal}
//         />
//       )}

//       <ToastContainer />
//     </div>
//   );
// };

// // Main App Component with Provider and Error Boundary
// const ProfilePage: React.FC = () => {
//   return (
//     <ErrorBoundary>
//       <AppProvider>
//         <AppContent />
//       </AppProvider>
//     </ErrorBoundary>
//   );
// };

// export default ProfilePage;




// Profile Page - Complete with All Fixes
import React, { useState, useEffect } from 'react';
import { AppProvider, usePosts, useProfile as useNewProfile } from '../../contexts/AppContext';
import { ToastContainer } from '../../components/ProfilePage/common/Toast/ToastContainer';
import { SearchModal } from '../../components/ProfilePage/explore/SearchModal/SearchModal';
import { useModal } from '../../hooks/useModal';

// Components
import ProfileHeader from '../../components/ProfilePage/Dashboard/Profileheader/ProfileHeader';
import TabNavigation from '../../components/ProfilePage/Dashboard/TabNavigation/Tabnavigation';
import EnhancedPostGrid from '../../components/ProfilePage/Dashboard/PostGrid/EnhancedPostGrid';
import PostModal from '../../components/ProfilePage/Dashboard/PostModal/PostModal';
import MobileNavigation from '../../components/ProfilePage/NavigationBar/MobileNavigation/MobileNavigation';

// Data and hooks
import { mockReels } from '../../data/mockData';
import { useProfile } from '../../hooks/usePersonalProfile';
import type { UserProfile, Post } from '../../types';
import '../../styles/globals.css';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <h2>Something went wrong.</h2>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              marginTop: '10px',
              border: 'none',
              borderRadius: '5px',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingScreen: React.FC = () => (
  <div className="app">
    <div className="container">
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh'
      }}>
        <div>Loading profile...</div>
      </div>
    </div>
  </div>
);

// App Content Component (uses hooks, must be inside provider)
const AppContent: React.FC = () => {
  // Local UI state hook
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

  // Context hooks
  const { posts, addPost } = usePosts();
  const { currentUser, updateProfile } = useNewProfile();

  // Local state
  const [reels, setReels] = useState<Post[]>(mockReels);
  const searchModal = useModal();

  // Add profile-page-active class to body for CSS targeting
  useEffect(() => {
    document.body.classList.add('profile-page-active');
    
    return () => {
      document.body.classList.remove('profile-page-active');
    };
  }, []);

  // Event handlers
  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    updateProfile(updatedProfile);
  };

  const handleNewPost = (postData: Omit<Post, 'id' | 'createdAt'>) => {
    addPost(postData);
  };

  // FIXED: Delete post functionality
  const handleDeletePost = (postId: string) => {
    console.log('Deleting post:', postId);
    
    // Remove from posts
    deletePost(postId);
    
    // Remove from reels if it exists there
    setReels(prev => prev.filter(reel => reel.id !== postId));
    
    // Clear any selected post if it's the one being deleted
    if (selectedPost && selectedPost.id === postId) {
      handleCloseModal();
    }
    
    // Show success message (optional)
    console.log('Post deleted successfully');
  };

  // FIXED: Proper logout functionality
  const handleLogout = () => {
    console.log('Logging out user...');
    
    try {
      // Clear all stored data
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      
      // Clear session storage
      sessionStorage.clear();
      
      // Clear any app state if needed
      // resetAppState(); // Implement if you have global state to reset
      
      // Redirect to login page
      window.location.href = '/login'; // Adjust path as needed
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if there's an error
      window.location.href = '/login';
    }
  };

  const handleSearch = () => {
    searchModal.openModal();
  };

  const handleNotifications = () => {
    console.log('Notifications clicked');
    // TODO: Implement notifications functionality
  };

  const handleMessages = () => {
    console.log('Messages clicked');
    // TODO: Implement messages functionality
  };

  const handleMore = () => {
    console.log('More clicked');
    // TODO: Implement more menu functionality
  };

  // Tab content logic
  const getTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <EnhancedPostGrid 
            posts={posts || []}
            onPostClick={handlePostClick}
            activeTab={activeTab}
            likedPosts={likedPosts}
            onLike={handleLikePost}
            onDeletePost={handleDeletePost} // Pass delete handler
            isOwnProfile={true} // Show delete buttons
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
            onDeletePost={handleDeletePost} // Pass delete handler
            isOwnProfile={true} // Show delete buttons
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
            onDeletePost={handleDeletePost} // Pass delete handler
            isOwnProfile={false} // Don't show delete buttons for tagged posts
          />
        );
      default:
        return null;
    }
  };

  // Show loading if currentUser is not available
  if (!currentUser) {
    return <LoadingScreen />;
  }

  return (
    <div className="app profile-page-container">
      <div className="container">
        <MobileNavigation 
          username={currentUser.username}
          onNotifications={handleNotifications}
          onMessages={handleMessages}
          onMore={handleMore}
        />
        
        <ProfileHeader 
          profile={currentUser}
          isFollowing={isFollowing} 
          onFollowToggle={handleFollowToggle}
          isOwnProfile={true}
          onProfileUpdate={handleProfileUpdate}
          onNewPost={handleNewPost}
          onLogout={handleLogout} // Pass logout handler
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
      </div>

      {searchModal.isOpen && (
        <SearchModal 
          onClose={searchModal.closeModal}
        />
      )}

      <ToastContainer />
    </div>
  );
};

// Main App Component with Provider and Error Boundary
const ProfilePage: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default ProfilePage;