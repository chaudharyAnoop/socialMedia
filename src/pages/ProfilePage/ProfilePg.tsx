// // // src/pages/ProfilePage/ProfilePg.tsx - CLEAN REPLACEMENT FOR ALL COMPLEX FILES

// // import React, { useState, useEffect } from 'react';
// // import { useParams } from 'react-router-dom';
// // import './ProfilePage.css';

// // // Simple Types
// // interface User {
// //   id: string;
// //   username: string;
// //   fullName: string;
// //   bio: string;
// //   profilePicture: string;
// //   followersCount: number;
// //   followingCount: number;
// //   postsCount: number;
// //   isFollowing: boolean;
// //   isPrivate: boolean;
// //   isVerified?: boolean;
// //   website?: string;
// // }

// // interface Post {
// //   id: string;
// //   imageUrl: string;
// //   likesCount: number;
// //   commentsCount: number;
// //   caption?: string;
// //   createdAt: string;
// //   isVideo?: boolean;
// // }

// // // API Configuration - UPDATE WITH YOUR SWAGGER ENDPOINTS
// // const API_BASE_URL = 'http://172.50.5.102:3000/api'; // UPDATE: Use 3000 or 3011 based on your Swagger

// // // Simple API Functions
// // const getAuthToken = () => localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
// // const getCurrentUserId = () => localStorage.getItem('userId') || sessionStorage.getItem('userId');

// // const apiCall = async (endpoint: string, options: RequestInit = {}) => {
// //   try {
// //     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': `Bearer ${getAuthToken()}`,
// //         ...options.headers,
// //       },
// //       ...options,
// //     });
    
// //     if (!response.ok) {
// //       throw new Error(`API Error: ${response.status} ${response.statusText}`);
// //     }
    
// //     return response.json();
// //   } catch (error) {
// //     console.error('API call failed:', endpoint, error);
// //     throw error;
// //   }
// // };

// // // Profile Header Component - Replaces your complex ProfileHeader
// // const ProfileHeader: React.FC<{
// //   user: User;
// //   isOwnProfile: boolean;
// //   onFollowToggle: () => void;
// // }> = ({ user, isOwnProfile, onFollowToggle }) => (
// //   <div className="profile-header">
// //     <div className="profile-picture-container">
// //       <img
// //         src={user.profilePicture || '/default-avatar.png'}
// //         alt={user.username}
// //         className="profile-picture"
// //         onError={(e) => {
// //           (e.target as HTMLImageElement).src = '/default-avatar.png';
// //         }}
// //       />
// //     </div>
    
// //     <div className="profile-info">
// //       <div className="profile-username-section">
// //         <h1 className="username">{user.username}</h1>
// //         {user.isVerified && (
// //           <svg className="verified-badge" fill="currentColor" viewBox="0 0 20 20">
// //             <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
// //           </svg>
// //         )}
        
// //         {isOwnProfile ? (
// //           <button className="edit-profile-btn">Edit Profile</button>
// //         ) : (
// //           <button 
// //             className={`follow-btn ${user.isFollowing ? 'following' : 'follow'}`}
// //             onClick={onFollowToggle}
// //           >
// //             {user.isFollowing ? 'Following' : 'Follow'}
// //           </button>
// //         )}
// //       </div>
      
// //       <div className="profile-stats">
// //         <div className="stat">
// //           <span className="stat-number">{user.postsCount.toLocaleString()}</span>
// //           <span className="stat-label">posts</span>
// //         </div>
// //         <div className="stat">
// //           <span className="stat-number">{user.followersCount.toLocaleString()}</span>
// //           <span className="stat-label">followers</span>
// //         </div>
// //         <div className="stat">
// //           <span className="stat-number">{user.followingCount.toLocaleString()}</span>
// //           <span className="stat-label">following</span>
// //         </div>
// //       </div>
      
// //       <div className="profile-bio">
// //         <p className="full-name">{user.fullName}</p>
// //         <p className="bio">{user.bio}</p>
// //         {user.website && (
// //           <a href={`https://${user.website}`} className="website" target="_blank" rel="noopener noreferrer">
// //             {user.website}
// //           </a>
// //         )}
// //       </div>
// //     </div>
// //   </div>
// // );

// // // Posts Grid Component - Replaces your complex EnhancedPostGrid
// // const PostsGrid: React.FC<{
// //   posts: Post[];
// //   isPrivate: boolean;
// //   isFollowing: boolean;
// //   isOwnProfile: boolean;
// // }> = ({ posts, isPrivate, isFollowing, isOwnProfile }) => {
// //   if (isPrivate && !isFollowing && !isOwnProfile) {
// //     return (
// //       <div className="empty-state">
// //         <div className="empty-icon">🔒</div>
// //         <h3>This Account is Private</h3>
// //         <p>Follow to see their posts</p>
// //       </div>
// //     );
// //   }

// //   if (posts.length === 0) {
// //     return (
// //       <div className="empty-state">
// //         <div className="empty-icon">📷</div>
// //         <h3>No Posts Yet</h3>
// //         {isOwnProfile && <p>Share a photo to get started</p>}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="posts-grid">
// //       {posts.map((post) => (
// //         <div key={post.id} className="post-item">
// //           <img
// //             src={post.imageUrl}
// //             alt="Post"
// //             className="post-image"
// //             loading="lazy"
// //             onError={(e) => {
// //               (e.target as HTMLImageElement).src = '/default-avatar.png';
// //             }}
// //           />
// //           <div className="post-overlay">
// //             <div className="post-stats">
// //               <span>❤️ {post.likesCount.toLocaleString()}</span>
// //               <span>💬 {post.commentsCount.toLocaleString()}</span>
// //             </div>
// //           </div>
// //           {post.isVideo && <div className="video-indicator">▶️</div>}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // // Main Profile Page Component - REPLACES ALL YOUR COMPLEX COMPONENTS
// // const ProfilePage: React.FC = () => {
// //   const { userId } = useParams<{ userId?: string }>();
  
// //   // Simple state - replaces all your hooks (useUIState, useModal, etc.)
// //   const [user, setUser] = useState<User | null>(null);
// //   const [posts, setPosts] = useState<Post[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const currentUserId = getCurrentUserId();
// //   const isOwnProfile = !userId || userId === currentUserId;
// //   const profileUserId = userId || currentUserId;

// //   // Fetch user data - replaces your complex API contexts
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       if (!profileUserId) {
// //         setError('No user ID found. Please log in.');
// //         setLoading(false);
// //         return;
// //       }

// //       try {
// //         setLoading(true);
// //         setError(null);

// //         console.log('Fetching profile for user:', profileUserId);

// //         // TODO: UPDATE THESE ENDPOINTS TO MATCH YOUR SWAGGER DOCUMENTATION
// //         const [userData, postsData] = await Promise.all([
// //           apiCall(`/users/${profileUserId}`),        // UPDATE: Your user profile endpoint
// //           apiCall(`/users/${profileUserId}/posts`)   // UPDATE: Your user posts endpoint
// //         ]);

// //         console.log('User data:', userData);
// //         console.log('Posts data:', postsData);

// //         setUser(userData);
// //         setPosts(postsData || []);
// //       } catch (err) {
// //         console.error('Error fetching profile:', err);
// //         setError(err instanceof Error ? err.message : 'Failed to load profile');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [profileUserId]);

// //   // Handle follow/unfollow - replaces your complex follow logic
// //   const handleFollowToggle = async () => {
// //     if (!user) return;

// //     try {
// //       const endpoint = user.isFollowing 
// //         ? `/users/${user.id}/unfollow`   // UPDATE: Your unfollow endpoint
// //         : `/users/${user.id}/follow`;    // UPDATE: Your follow endpoint
      
// //       console.log('Follow/unfollow:', endpoint);
      
// //       await apiCall(endpoint, { method: 'POST' });

// //       // Update local state
// //       setUser(prev => prev ? {
// //         ...prev,
// //         isFollowing: !prev.isFollowing,
// //         followersCount: prev.isFollowing 
// //           ? prev.followersCount - 1 
// //           : prev.followersCount + 1
// //       } : null);

// //       console.log('Follow status updated successfully');
// //     } catch (err) {
// //       console.error('Follow/unfollow failed:', err);
// //       // You can add toast notification here if needed
// //     }
// //   };

// //   // Loading state
// //   if (loading) {
// //     return (
// //       <div className="profile-container">
// //         <div className="loading-state">
// //           <div className="loading-spinner"></div>
// //           <p>Loading profile...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Error state
// //   if (error || !user) {
// //     return (
// //       <div className="profile-container">
// //         <div className="error-state">
// //           <h3>Oops! Something went wrong</h3>
// //           <p>{error || 'User not found'}</p>
// //           <button onClick={() => window.location.reload()}>
// //             Try Again
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Main render - Clean and simple
// //   return (
// //     <div className="profile-container">
// //       <div className="profile-content">
// //         <ProfileHeader
// //           user={user}
// //           isOwnProfile={isOwnProfile}
// //           onFollowToggle={handleFollowToggle}
// //         />
        
// //         <div className="profile-sections">
// //           <div className="section-tabs">
// //             <button className="tab active">
// //               <span className="tab-icon">⊞</span>
// //               <span className="tab-label">POSTS</span>
// //             </button>
// //           </div>
          
// //           <PostsGrid
// //             posts={posts}
// //             isPrivate={user.isPrivate}
// //             isFollowing={user.isFollowing}
// //             isOwnProfile={isOwnProfile}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfilePage;




// // src/pages/ProfilePage/ProfilePg.tsx - Complete Instagram Profile with Embedded Styles

// // import React, { useState, useEffect } from 'react';
// // import { useParams } from 'react-router-dom';

// // // Simple Types
// // interface User {
// //   id: string;
// //   username: string;
// //   fullName: string;
// //   bio: string;
// //   profilePicture: string;
// //   followersCount: number;
// //   followingCount: number;
// //   postsCount: number;
// //   isFollowing: boolean;
// //   isPrivate: boolean;
// //   isVerified?: boolean;
// //   website?: string;
// // }

// // interface Post {
// //   id: string;
// //   imageUrl: string;
// //   likesCount: number;
// //   commentsCount: number;
// //   caption?: string;
// //   createdAt: string;
// //   isVideo?: boolean;
// // }

// // // Mock Data for Testing
// // const MOCK_USER: User = {
// //   id: 'user123',
// //   username: 'john_doe',
// //   fullName: 'John Doe',
// //   bio: 'Software Developer | Photography Enthusiast\n📍 San Francisco\n✨ Living life one post at a time',
// //   profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
// //   followersCount: 2547,
// //   followingCount: 312,
// //   postsCount: 89,
// //   isFollowing: false,
// //   isPrivate: false,
// //   isVerified: true,
// //   website: 'johndoe.dev'
// // };

// // const MOCK_POSTS: Post[] = [
// //   {
// //     id: 'post1',
// //     imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
// //     likesCount: 142,
// //     commentsCount: 23,
// //     caption: 'Beautiful sunset!',
// //     createdAt: '2024-01-15T10:30:00Z',
// //   },
// //   {
// //     id: 'post2',
// //     imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop',
// //     likesCount: 89,
// //     commentsCount: 12,
// //     caption: 'Nature vibes',
// //     createdAt: '2024-01-14T15:20:00Z',
// //   },
// //   {
// //     id: 'post3',
// //     imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop',
// //     likesCount: 203,
// //     commentsCount: 45,
// //     caption: 'Perfect weather today!',
// //     createdAt: '2024-01-13T08:45:00Z',
// //   },
// //   {
// //     id: 'post4',
// //     imageUrl: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=300&h=300&fit=crop',
// //     likesCount: 67,
// //     commentsCount: 8,
// //     caption: 'City lights',
// //     createdAt: '2024-01-12T20:15:00Z',
// //   },
// //   {
// //     id: 'post5',
// //     imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
// //     likesCount: 156,
// //     commentsCount: 29,
// //     caption: 'Forest adventure',
// //     createdAt: '2024-01-11T11:30:00Z',
// //   },
// //   {
// //     id: 'post6',
// //     imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=300&fit=crop',
// //     likesCount: 234,
// //     commentsCount: 67,
// //     caption: 'Mountain peak conquered! 🏔️',
// //     createdAt: '2024-01-10T16:45:00Z',
// //   }
// // ];

// // // Embedded Styles - Instagram UI
// // const styles: { [key: string]: React.CSSProperties } = {
// //   container: {
// //     width: '100%',
// //     minHeight: '100vh',
// //     backgroundColor: '#fafafa',
// //     color: '#262626',
// //     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
// //   },
// //   content: {
// //     maxWidth: '935px',
// //     margin: '0 auto',
// //     padding: '30px 20px',
// //   },
// //   demoBanner: {
// //     background: '#0095f6',
// //     color: 'white',
// //     padding: '10px 20px',
// //     borderRadius: '8px',
// //     marginBottom: '20px',
// //     textAlign: 'center' as const,
// //     fontSize: '14px',
// //   },
// //   profileHeader: {
// //     display: 'flex',
// //     gap: '30px',
// //     marginBottom: '44px',
// //     paddingBottom: '20px',
// //     borderBottom: '1px solid #dbdbdb',
// //   },
// //   profilePictureContainer: {
// //     flexShrink: 0,
// //   },
// //   profilePicture: {
// //     width: '150px',
// //     height: '150px',
// //     borderRadius: '50%',
// //     objectFit: 'cover' as const,
// //     border: '2px solid #dbdbdb',
// //   },
// //   profileInfo: {
// //     flex: 1,
// //     display: 'flex',
// //     flexDirection: 'column' as const,
// //     gap: '20px',
// //   },
// //   usernameSection: {
// //     display: 'flex',
// //     alignItems: 'center',
// //     gap: '20px',
// //     flexWrap: 'wrap' as const,
// //   },
// //   username: {
// //     fontSize: '28px',
// //     fontWeight: '300',
// //     margin: '0',
// //     display: 'flex',
// //     alignItems: 'center',
// //     gap: '8px',
// //   },
// //   verifiedBadge: {
// //     width: '18px',
// //     height: '18px',
// //     color: '#0095f6',
// //   },
// //   button: {
// //     padding: '8px 24px',
// //     borderRadius: '8px',
// //     border: '1px solid #dbdbdb',
// //     cursor: 'pointer',
// //     fontWeight: '600',
// //     fontSize: '14px',
// //     background: 'transparent',
// //     color: '#262626',
// //     transition: 'all 0.2s ease',
// //   },
// //   followButton: {
// //     background: '#0095f6',
// //     color: 'white',
// //     borderColor: '#0095f6',
// //   },
// //   stats: {
// //     display: 'flex',
// //     gap: '40px',
// //   },
// //   stat: {
// //     display: 'flex',
// //     flexDirection: 'column' as const,
// //     alignItems: 'center',
// //     textAlign: 'center' as const,
// //   },
// //   statNumber: {
// //     fontSize: '18px',
// //     fontWeight: '600',
// //   },
// //   statLabel: {
// //     fontSize: '16px',
// //     color: '#262626',
// //   },
// //   bio: {
// //     maxWidth: '400px',
// //   },
// //   fullName: {
// //     fontWeight: '600',
// //     margin: '0 0 4px 0',
// //   },
// //   bioText: {
// //     margin: '0 0 8px 0',
// //     lineHeight: '1.4',
// //     whiteSpace: 'pre-wrap' as const,
// //   },
// //   website: {
// //     color: '#0095f6',
// //     textDecoration: 'none',
// //     fontWeight: '600',
// //   },
// //   sections: {
// //     marginTop: '44px',
// //   },
// //   tabs: {
// //     display: 'flex',
// //     justifyContent: 'center',
// //     marginBottom: '24px',
// //   },
// //   tab: {
// //     background: 'none',
// //     border: 'none',
// //     padding: '12px 0',
// //     margin: '0 60px',
// //     fontSize: '12px',
// //     fontWeight: '600',
// //     letterSpacing: '1px',
// //     cursor: 'pointer',
// //     borderTop: '1px solid #262626',
// //     color: '#262626',
// //     display: 'flex',
// //     alignItems: 'center',
// //     gap: '6px',
// //   },
// //   postsGrid: {
// //     display: 'grid',
// //     gridTemplateColumns: 'repeat(3, 1fr)',
// //     gap: '4px',
// //   },
// //   postItem: {
// //     position: 'relative' as const,
// //     aspectRatio: '1',
// //     cursor: 'pointer',
// //     overflow: 'hidden',
// //   },
// //   postImage: {
// //     width: '100%',
// //     height: '100%',
// //     objectFit: 'cover' as const,
// //     transition: 'transform 0.2s ease',
// //   },
// //   postOverlay: {
// //     position: 'absolute' as const,
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     background: 'rgba(0, 0, 0, 0.5)',
// //     display: 'flex',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     opacity: 0,
// //     transition: 'opacity 0.2s ease',
// //   },
// //   postStats: {
// //     display: 'flex',
// //     gap: '20px',
// //     color: 'white',
// //     fontWeight: '600',
// //     fontSize: '16px',
// //   },
// //   loading: {
// //     display: 'flex',
// //     flexDirection: 'column' as const,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     height: '200px',
// //     textAlign: 'center' as const,
// //     gap: '16px',
// //   },
// //   spinner: {
// //     width: '40px',
// //     height: '40px',
// //     border: '3px solid #f3f3f3',
// //     borderTop: '3px solid #0095f6',
// //     borderRadius: '50%',
// //     animation: 'spin 1s linear infinite',
// //   },
// //   emptyState: {
// //     display: 'flex',
// //     flexDirection: 'column' as const,
// //     alignItems: 'center',
// //     padding: '60px 20px',
// //     textAlign: 'center' as const,
// //   },
// //   emptyIcon: {
// //     fontSize: '64px',
// //     marginBottom: '16px',
// //     opacity: 0.6,
// //   },
// // };

// // // Simple API Functions
// // const getAuthToken = () => localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
// // const getCurrentUserId = () => localStorage.getItem('userId') || sessionStorage.getItem('userId');

// // const apiCall = async (endpoint: string, options: RequestInit = {}) => {
// //   console.log(`Mock API call: ${endpoint}`);
// //   await new Promise(resolve => setTimeout(resolve, 1000));
  
// //   if (endpoint.includes('/posts')) {
// //     return MOCK_POSTS;
// //   }
  
// //   if (endpoint.includes('/users/')) {
// //     return MOCK_USER;
// //   }
// // };

// // // Profile Header Component
// // const ProfileHeader: React.FC<{
// //   user: User;
// //   isOwnProfile: boolean;
// //   onFollowToggle: () => void;
// // }> = ({ user, isOwnProfile, onFollowToggle }) => (
// //   <div style={styles.profileHeader}>
// //     <div style={styles.profilePictureContainer}>
// //       <img
// //         src={user.profilePicture}
// //         alt={user.username}
// //         style={styles.profilePicture}
// //         onError={(e) => {
// //           (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x150?text=Avatar';
// //         }}
// //       />
// //     </div>
    
// //     <div style={styles.profileInfo}>
// //       <div style={styles.usernameSection}>
// //         <h1 style={styles.username}>
// //           {user.username}
// //           {user.isVerified && (
// //             <svg style={styles.verifiedBadge} fill="currentColor" viewBox="0 0 20 20">
// //               <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
// //             </svg>
// //           )}
// //         </h1>
        
// //         {isOwnProfile ? (
// //           <button style={styles.button}>Edit Profile</button>
// //         ) : (
// //           <button 
// //             style={{...styles.button, ...(user.isFollowing ? {} : styles.followButton)}}
// //             onClick={onFollowToggle}
// //           >
// //             {user.isFollowing ? 'Following' : 'Follow'}
// //           </button>
// //         )}
// //       </div>
      
// //       <div style={styles.stats}>
// //         <div style={styles.stat}>
// //           <span style={styles.statNumber}>{user.postsCount.toLocaleString()}</span>
// //           <span style={styles.statLabel}>posts</span>
// //         </div>
// //         <div style={styles.stat}>
// //           <span style={styles.statNumber}>{user.followersCount.toLocaleString()}</span>
// //           <span style={styles.statLabel}>followers</span>
// //         </div>
// //         <div style={styles.stat}>
// //           <span style={styles.statNumber}>{user.followingCount.toLocaleString()}</span>
// //           <span style={styles.statLabel}>following</span>
// //         </div>
// //       </div>
      
// //       <div style={styles.bio}>
// //         <p style={styles.fullName}>{user.fullName}</p>
// //         <p style={styles.bioText}>{user.bio}</p>
// //         {user.website && (
// //           <a href={`https://${user.website}`} style={styles.website} target="_blank" rel="noopener noreferrer">
// //             {user.website}
// //           </a>
// //         )}
// //       </div>
// //     </div>
// //   </div>
// // );

// // // Posts Grid Component
// // const PostsGrid: React.FC<{
// //   posts: Post[];
// //   isPrivate: boolean;
// //   isFollowing: boolean;
// //   isOwnProfile: boolean;
// // }> = ({ posts, isPrivate, isFollowing, isOwnProfile }) => {
// //   const [hoveredPost, setHoveredPost] = useState<string | null>(null);

// //   if (isPrivate && !isFollowing && !isOwnProfile) {
// //     return (
// //       <div style={styles.emptyState}>
// //         <div style={styles.emptyIcon}>🔒</div>
// //         <h3>This Account is Private</h3>
// //         <p>Follow to see their posts</p>
// //       </div>
// //     );
// //   }

// //   if (posts.length === 0) {
// //     return (
// //       <div style={styles.emptyState}>
// //         <div style={styles.emptyIcon}>📷</div>
// //         <h3>No Posts Yet</h3>
// //         {isOwnProfile && <p>Share a photo to get started</p>}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={styles.postsGrid}>
// //       {posts.map((post) => (
// //         <div 
// //           key={post.id} 
// //           style={styles.postItem}
// //           onMouseEnter={() => setHoveredPost(post.id)}
// //           onMouseLeave={() => setHoveredPost(null)}
// //         >
// //           <img
// //             src={post.imageUrl}
// //             alt="Post"
// //             style={{
// //               ...styles.postImage,
// //               transform: hoveredPost === post.id ? 'scale(1.05)' : 'scale(1)'
// //             }}
// //             loading="lazy"
// //           />
// //           <div 
// //             style={{
// //               ...styles.postOverlay,
// //               opacity: hoveredPost === post.id ? 1 : 0
// //             }}
// //           >
// //             <div style={styles.postStats}>
// //               <span>❤️ {post.likesCount.toLocaleString()}</span>
// //               <span>💬 {post.commentsCount.toLocaleString()}</span>
// //             </div>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // // Main Profile Page Component
// // const ProfilePage: React.FC = () => {
// //   const { userId } = useParams<{ userId?: string }>();
// //   const [user, setUser] = useState<User | null>(null);
// //   const [posts, setPosts] = useState<Post[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const currentUserId = getCurrentUserId() || 'demo-user';
// //   const isOwnProfile = !userId || userId === currentUserId;
// //   const profileUserId = userId || currentUserId;

// //   // Setup demo user on load
// //   useEffect(() => {
// //     if (!localStorage.getItem('userId')) {
// //       localStorage.setItem('userId', 'demo-user');
// //       localStorage.setItem('authToken', 'demo-token-12345');
// //     }
// //   }, []);

// //   // Fetch data
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);

// //         const [userData, postsData] = await Promise.all([
// //           apiCall(`/users/${profileUserId}`),
// //           apiCall(`/users/${profileUserId}/posts`)
// //         ]);

// //         setUser(userData);
// //         setPosts(postsData || []);
// //       } catch (err) {
// //         console.error('Error fetching profile:', err);
// //         setError(err instanceof Error ? err.message : 'Failed to load profile');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [profileUserId]);

// //   // Handle follow/unfollow
// //   const handleFollowToggle = async () => {
// //     if (!user) return;

// //     try {
// //       await new Promise(resolve => setTimeout(resolve, 500));
// //       setUser(prev => prev ? {
// //         ...prev,
// //         isFollowing: !prev.isFollowing,
// //         followersCount: prev.isFollowing 
// //           ? prev.followersCount - 1 
// //           : prev.followersCount + 1
// //       } : null);
// //     } catch (err) {
// //       console.error('Follow/unfollow failed:', err);
// //     }
// //   };

// //   // Add CSS animation for spinner
// //   useEffect(() => {
// //     const style = document.createElement('style');
// //     style.textContent = `
// //       @keyframes spin {
// //         0% { transform: rotate(0deg); }
// //         100% { transform: rotate(360deg); }
// //       }
// //     `;
// //     document.head.appendChild(style);
// //     return () => document.head.removeChild(style);
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div style={styles.container}>
// //         <div style={styles.content}>
// //           <div style={styles.loading}>
// //             <div style={styles.spinner}></div>
// //             <p>Loading profile...</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error || !user) {
// //     return (
// //       <div style={styles.container}>
// //         <div style={styles.content}>
// //           <div style={styles.loading}>
// //             <h3>Oops! Something went wrong</h3>
// //             <p>{error || 'User not found'}</p>
// //             <button onClick={() => window.location.reload()}>
// //               Try Again
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={styles.container}>
// //       <div style={styles.content}>
// //         <div style={styles.demoBanner}>
// //           🎉 Demo Mode - Instagram Profile Working! Replace mock data with real API endpoints.
// //         </div>

// //         <ProfileHeader
// //           user={user}
// //           isOwnProfile={isOwnProfile}
// //           onFollowToggle={handleFollowToggle}
// //         />
        
// //         <div style={styles.sections}>
// //           <div style={styles.tabs}>
// //             <button style={styles.tab}>
// //               <span>⊞</span>
// //               <span>POSTS</span>
// //             </button>
// //           </div>
          
// //           <PostsGrid
// //             posts={posts}
// //             isPrivate={user.isPrivate}
// //             isFollowing={user.isFollowing}
// //             isOwnProfile={isOwnProfile}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfilePage;

// // src/pages/ProfilePage/ProfilePg.tsx - Instagram Profile with Real API Integration

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// // Types
// interface User {
//   id: string;
//   username: string;
//   fullName: string;
//   email: string;
//   bio: string;
//   profilePicture: string;
//   followersCount: number;
//   followingCount: number;
//   postsCount: number;
//   isFollowing: boolean;
//   isPrivate: boolean;
//   isVerified?: boolean;
//   website?: string;
//   accountType: string;
//   isActive: boolean;
// }

// interface Post {
//   id: string;
//   imageUrl: string;
//   likesCount: number;
//   commentsCount: number;
//   caption?: string;
//   createdAt: string;
//   isVideo?: boolean;
// }

// // API Configuration
// const API_BASE_URL = 'http://172.50.5.102:3011';

// // Mock Posts Data (since posts array is empty in API)
// const MOCK_POSTS: Post[] = [
//   {
//     id: 'post1',
//     imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
//     likesCount: 142,
//     commentsCount: 23,
//     caption: 'Beautiful sunset! 🌅',
//     createdAt: '2024-01-15T10:30:00Z',
//   },
//   {
//     id: 'post2',
//     imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop',
//     likesCount: 89,
//     commentsCount: 12,
//     caption: 'Nature vibes 🌲',
//     createdAt: '2024-01-14T15:20:00Z',
//   },
//   {
//     id: 'post3',
//     imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop',
//     likesCount: 203,
//     commentsCount: 45,
//     caption: 'Perfect weather today! ☀️',
//     createdAt: '2024-01-13T08:45:00Z',
//   },
//   {
//     id: 'post4',
//     imageUrl: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=300&h=300&fit=crop',
//     likesCount: 67,
//     commentsCount: 8,
//     caption: 'City lights ✨',
//     createdAt: '2024-01-12T20:15:00Z',
//   },
//   {
//     id: 'post5',
//     imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
//     likesCount: 156,
//     commentsCount: 29,
//     caption: 'Forest adventure 🏕️',
//     createdAt: '2024-01-11T11:30:00Z',
//   },
//   {
//     id: 'post6',
//     imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=300&fit=crop',
//     likesCount: 234,
//     commentsCount: 67,
//     caption: 'Mountain peak conquered! 🏔️',
//     createdAt: '2024-01-10T16:45:00Z',
//   }
// ];

// // Embedded Styles - Instagram UI
// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     width: '100%',
//     minHeight: '100vh',
//     backgroundColor: '#fafafa',
//     color: '#262626',
//     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
//   },
//   content: {
//     maxWidth: '935px',
//     margin: '0 auto',
//     padding: '30px 20px',
//   },
//   apiBanner: {
//     background: 'linear-gradient(45deg, #0095f6, #00d4ff)',
//     color: 'white',
//     padding: '12px 20px',
//     borderRadius: '8px',
//     marginBottom: '20px',
//     textAlign: 'center' as const,
//     fontSize: '14px',
//     fontWeight: '500',
//     boxShadow: '0 2px 8px rgba(0, 149, 246, 0.3)',
//   },
//   profileHeader: {
//     display: 'flex',
//     gap: '30px',
//     marginBottom: '44px',
//     paddingBottom: '20px',
//     borderBottom: '1px solid #dbdbdb',
//   },
//   profilePictureContainer: {
//     flexShrink: 0,
//   },
//   profilePicture: {
//     width: '150px',
//     height: '150px',
//     borderRadius: '50%',
//     objectFit: 'cover' as const,
//     border: '3px solid #dbdbdb',
//     background: 'linear-gradient(45deg, #ffd89b 0%, #19547b 100%)',
//   },
//   profileInfo: {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column' as const,
//     gap: '20px',
//   },
//   usernameSection: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '20px',
//     flexWrap: 'wrap' as const,
//   },
//   username: {
//     fontSize: '28px',
//     fontWeight: '300',
//     margin: '0',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//   },
//   verifiedBadge: {
//     width: '18px',
//     height: '18px',
//     color: '#0095f6',
//   },
//   button: {
//     padding: '8px 24px',
//     borderRadius: '8px',
//     border: '1px solid #dbdbdb',
//     cursor: 'pointer',
//     fontWeight: '600',
//     fontSize: '14px',
//     background: 'transparent',
//     color: '#262626',
//     transition: 'all 0.2s ease',
//   },
//   followButton: {
//     background: '#0095f6',
//     color: 'white',
//     borderColor: '#0095f6',
//   },
//   stats: {
//     display: 'flex',
//     gap: '40px',
//   },
//   stat: {
//     display: 'flex',
//     flexDirection: 'column' as const,
//     alignItems: 'center',
//     textAlign: 'center' as const,
//   },
//   statNumber: {
//     fontSize: '18px',
//     fontWeight: '600',
//   },
//   statLabel: {
//     fontSize: '16px',
//     color: '#262626',
//   },
//   bio: {
//     maxWidth: '400px',
//   },
//   fullName: {
//     fontWeight: '600',
//     margin: '0 0 4px 0',
//   },
//   email: {
//     color: '#8e8e8e',
//     fontSize: '14px',
//     margin: '0 0 8px 0',
//   },
//   bioText: {
//     margin: '0 0 8px 0',
//     lineHeight: '1.4',
//     whiteSpace: 'pre-wrap' as const,
//   },
//   accountType: {
//     background: user => user.accountType === 'public' ? '#4CAF50' : '#FF9800',
//     color: 'white',
//     padding: '4px 8px',
//     borderRadius: '12px',
//     fontSize: '12px',
//     fontWeight: '600',
//     display: 'inline-block',
//     textTransform: 'uppercase' as const,
//   },
//   website: {
//     color: '#0095f6',
//     textDecoration: 'none',
//     fontWeight: '600',
//   },
//   sections: {
//     marginTop: '44px',
//   },
//   tabs: {
//     display: 'flex',
//     justifyContent: 'center',
//     marginBottom: '24px',
//   },
//   tab: {
//     background: 'none',
//     border: 'none',
//     padding: '12px 0',
//     margin: '0 60px',
//     fontSize: '12px',
//     fontWeight: '600',
//     letterSpacing: '1px',
//     cursor: 'pointer',
//     borderTop: '1px solid #262626',
//     color: '#262626',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '6px',
//   },
//   postsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(3, 1fr)',
//     gap: '4px',
//   },
//   postItem: {
//     position: 'relative' as const,
//     aspectRatio: '1',
//     cursor: 'pointer',
//     overflow: 'hidden',
//   },
//   postImage: {
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover' as const,
//     transition: 'transform 0.2s ease',
//   },
//   postOverlay: {
//     position: 'absolute' as const,
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     opacity: 0,
//     transition: 'opacity 0.2s ease',
//   },
//   postStats: {
//     display: 'flex',
//     gap: '20px',
//     color: 'white',
//     fontWeight: '600',
//     fontSize: '16px',
//   },
//   loading: {
//     display: 'flex',
//     flexDirection: 'column' as const,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '200px',
//     textAlign: 'center' as const,
//     gap: '16px',
//   },
//   spinner: {
//     width: '40px',
//     height: '40px',
//     border: '3px solid #f3f3f3',
//     borderTop: '3px solid #0095f6',
//     borderRadius: '50%',
//     animation: 'spin 1s linear infinite',
//   },
//   emptyState: {
//     display: 'flex',
//     flexDirection: 'column' as const,
//     alignItems: 'center',
//     padding: '60px 20px',
//     textAlign: 'center' as const,
//   },
//   emptyIcon: {
//     fontSize: '64px',
//     marginBottom: '16px',
//     opacity: 0.6,
//   },
//   errorState: {
//     display: 'flex',
//     flexDirection: 'column' as const,
//     alignItems: 'center',
//     padding: '60px 20px',
//     textAlign: 'center' as const,
//     gap: '16px',
//   },
//   retryButton: {
//     padding: '8px 24px',
//     borderRadius: '8px',
//     border: 'none',
//     cursor: 'pointer',
//     fontWeight: '600',
//     fontSize: '14px',
//     background: '#0095f6',
//     color: 'white',
//   },
// };

// // API Functions
// const getAuthToken = () => localStorage.getItem('access_token') || sessionStorage.getItem('authToken');

// const fetchUserProfile = async (): Promise<User> => {
//   try {
//     console.log('Fetching user profile from API...');
    
//     const response = await axios.get(`${API_BASE_URL}/users/profile`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${getAuthToken()}`,
//       },
//       timeout: 10000,
//     });
    
//     console.log('API Response:', response.data);
    
//     const data = response.data;
    
//     // Transform API response to match our User interface
//     return {
//       id: data._id,
//       username: data.username,
//       fullName: data.fullName,
//       email: data.email,
//       bio: data.bio,
//       profilePicture: data.profilePicture || 'https://via.placeholder.com/150x150?text=Avatar',
//       followersCount: data.followersCount,
//       followingCount: data.followingCount,
//       postsCount: data.posts?.length || MOCK_POSTS.length, // Use mock posts count since API posts is empty
//       isFollowing: false, // This would come from relationship check
//       isPrivate: data.isPrivate,
//       isVerified: false, // Not in API response, defaulting to false
//       website: undefined, // Not in API response
//       accountType: data.accountType,
//       isActive: data.isActive,
//     };
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
    
//     if (axios.isAxiosError(error)) {
//       if (error.response?.status === 401) {
//         throw new Error('Authentication required. Please log in.');
//       } else if (error.response?.status === 404) {
//         throw new Error('User profile not found.');
//       } else if (error.response?.status >= 500) {
//         throw new Error('Server error. Please try again later.');
//       } else if (error.code === 'ECONNABORTED') {
//         throw new Error('Request timeout. Please check your connection.');
//       }
//     }
    
//     throw new Error('Failed to load profile. Please check your connection.');
//   }
// };

// const followUser = async (userId: string): Promise<void> => {
//   try {
//     await axios.post(`${API_BASE_URL}/users/${userId}/follow`, {}, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${getAuthToken()}`,
//       },
//     });
//   } catch (error) {
//     console.error('Error following user:', error);
//     throw new Error('Failed to follow user');
//   }
// };

// const unfollowUser = async (userId: string): Promise<void> => {
//   try {
//     await axios.post(`${API_BASE_URL}/users/${userId}/unfollow`, {}, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${getAuthToken()}`,
//       },
//     });
//   } catch (error) {
//     console.error('Error unfollowing user:', error);
//     throw new Error('Failed to unfollow user');
//   }
// };

// // Profile Header Component
// const ProfileHeader: React.FC<{
//   user: User;
//   isOwnProfile: boolean;
//   onFollowToggle: () => void;
//   isFollowLoading: boolean;
// }> = ({ user, isOwnProfile, onFollowToggle, isFollowLoading }) => (
//   <div style={styles.profileHeader}>
//     <div style={styles.profilePictureContainer}>
//       <img
//         src={user.profilePicture}
//         alt={user.username}
//         style={styles.profilePicture}
//         onError={(e) => {
//           (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x150?text=' + user.username.charAt(0).toUpperCase();
//         }}
//       />
//     </div>
    
//     <div style={styles.profileInfo}>
//       <div style={styles.usernameSection}>
//         <h1 style={styles.username}>
//           {user.username}
//           {user.isVerified && (
//             <svg style={styles.verifiedBadge} fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//           )}
//         </h1>
        
//         <span style={{
//           ...styles.accountType,
//           background: user.accountType === 'public' ? '#4CAF50' : '#FF9800'
//         }}>
//           {user.accountType}
//         </span>
        
//         {isOwnProfile ? (
//           <button style={styles.button}>Edit Profile</button>
//         ) : (
//           <button 
//             style={{
//               ...styles.button, 
//               ...(user.isFollowing ? {} : styles.followButton),
//               opacity: isFollowLoading ? 0.6 : 1,
//               cursor: isFollowLoading ? 'not-allowed' : 'pointer'
//             }}
//             onClick={onFollowToggle}
//             disabled={isFollowLoading}
//           >
//             {isFollowLoading ? 'Loading...' : (user.isFollowing ? 'Following' : 'Follow')}
//           </button>
//         )}
//       </div>
      
//       <div style={styles.stats}>
//         <div style={styles.stat}>
//           <span style={styles.statNumber}>{user.postsCount.toLocaleString()}</span>
//           <span style={styles.statLabel}>posts</span>
//         </div>
//         <div style={styles.stat}>
//           <span style={styles.statNumber}>{user.followersCount.toLocaleString()}</span>
//           <span style={styles.statLabel}>followers</span>
//         </div>
//         <div style={styles.stat}>
//           <span style={styles.statNumber}>{user.followingCount.toLocaleString()}</span>
//           <span style={styles.statLabel}>following</span>
//         </div>
//       </div>
      
//       <div style={styles.bio}>
//         <p style={styles.fullName}>{user.fullName}</p>
//         <p style={styles.email}>{user.email}</p>
//         <p style={styles.bioText}>{user.bio}</p>
//         {user.website && (
//           <a 
//             href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
//             style={styles.website} 
//             target="_blank" 
//             rel="noopener noreferrer"
//           >
//             {user.website}
//           </a>
//         )}
//       </div>
//     </div>
//   </div>
// );

// // Posts Grid Component
// const PostsGrid: React.FC<{
//   posts: Post[];
//   isPrivate: boolean;
//   isFollowing: boolean;
//   isOwnProfile: boolean;
// }> = ({ posts, isPrivate, isFollowing, isOwnProfile }) => {
//   const [hoveredPost, setHoveredPost] = useState<string | null>(null);

//   if (isPrivate && !isFollowing && !isOwnProfile) {
//     return (
//       <div style={styles.emptyState}>
//         <div style={styles.emptyIcon}>🔒</div>
//         <h3>This Account is Private</h3>
//         <p>Follow to see their posts</p>
//       </div>
//     );
//   }

//   if (posts.length === 0) {
//     return (
//       <div style={styles.emptyState}>
//         <div style={styles.emptyIcon}>📷</div>
//         <h3>No Posts Yet</h3>
//         {isOwnProfile && <p>Share a photo to get started</p>}
//       </div>
//     );
//   }

//   return (
//     <div style={styles.postsGrid}>
//       {posts.map((post) => (
//         <div 
//           key={post.id} 
//           style={styles.postItem}
//           onMouseEnter={() => setHoveredPost(post.id)}
//           onMouseLeave={() => setHoveredPost(null)}
//         >
//           <img
//             src={post.imageUrl}
//             alt="Post"
//             style={{
//               ...styles.postImage,
//               transform: hoveredPost === post.id ? 'scale(1.05)' : 'scale(1)'
//             }}
//             loading="lazy"
//             onError={(e) => {
//               (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Image';
//             }}
//           />
//           <div 
//             style={{
//               ...styles.postOverlay,
//               opacity: hoveredPost === post.id ? 1 : 0
//             }}
//           >
//             <div style={styles.postStats}>
//               <span>❤️ {post.likesCount.toLocaleString()}</span>
//               <span>💬 {post.commentsCount.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// // Main Profile Page Component
// const ProfilePage: React.FC = () => {
//   const { userId } = useParams<{ userId?: string }>();
//   const [user, setUser] = useState<User | null>(null);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [followLoading, setFollowLoading] = useState(false);

//   const isOwnProfile = true; // Since we're fetching current user's profile

//   // Setup demo authentication if not exists
//   useEffect(() => {
//     if (!localStorage.getItem('authToken')) {
//       // You should set a real token here from your login process
//       localStorage.setItem('authToken', 'your-auth-token-here');
//     }
//   }, []);

//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         console.log('Fetching profile data...');

//         // Fetch user profile from real API
//         const userData = await fetchUserProfile();
//         setUser(userData);

//         // Use mock posts since API posts array is empty
//         setPosts(MOCK_POSTS);

//         console.log('Profile loaded successfully:', userData);
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//         setError(err instanceof Error ? err.message : 'Failed to load profile');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle follow/unfollow
//   const handleFollowToggle = async () => {
//     if (!user || isOwnProfile) return;

//     try {
//       setFollowLoading(true);
      
//       if (user.isFollowing) {
//         await unfollowUser(user.id);
//       } else {
//         await followUser(user.id);
//       }

//       // Update local state
//       setUser(prev => prev ? {
//         ...prev,
//         isFollowing: !prev.isFollowing,
//         followersCount: prev.isFollowing 
//           ? prev.followersCount - 1 
//           : prev.followersCount + 1
//       } : null);

//       console.log('Follow status updated successfully');
//     } catch (err) {
//       console.error('Follow/unfollow failed:', err);
//       alert(err instanceof Error ? err.message : 'Failed to update follow status');
//     } finally {
//       setFollowLoading(false);
//     }
//   };

//   // Add CSS animation for spinner
//   useEffect(() => {
//     const style = document.createElement('style');
//     style.textContent = `
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   if (loading) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.content}>
//           <div style={styles.loading}>
//             <div style={styles.spinner}></div>
//             <p>Loading profile...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !user) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.content}>
//           <div style={styles.errorState}>
//             <div style={styles.emptyIcon}>⚠️</div>
//             <h3>Oops! Something went wrong</h3>
//             <p>{error || 'User not found'}</p>
//             <button 
//               style={styles.retryButton}
//               onClick={() => window.location.reload()}
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.content}>
//         <div style={styles.apiBanner}>
//           ✅ Real API Data Loaded: {user.username} | Followers: {user.followersCount} | Following: {user.followingCount} | Posts: Mock Data
//         </div>

//         <ProfileHeader
//           user={user}
//           isOwnProfile={isOwnProfile}
//           onFollowToggle={handleFollowToggle}
//           isFollowLoading={followLoading}
//         />
        
//         <div style={styles.sections}>
//           <div style={styles.tabs}>
//             <button style={styles.tab}>
//               <span>⊞</span>
//               <span>POSTS</span>
//             </button>
//           </div>
          
//           <PostsGrid
//             posts={posts}
//             isPrivate={user.isPrivate}
//             isFollowing={user.isFollowing}
//             isOwnProfile={isOwnProfile}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
// src/pages/ProfilePage/ProfilePg.tsx - Instagram Profile with Following/Followers Modal


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import styles from './ProfilePage.module.css';

// // Types
// interface User {
//   id: string;
//   username: string;
//   fullName: string;
//   email: string;
//   bio: string;
//   profilePicture: string;
//   followersCount: number;
//   followingCount: number;
//   postsCount: number;
//   isFollowing: boolean;
//   isPrivate: boolean;
//   isVerified?: boolean;
//   website?: string;
//   accountType: string;
//   isActive: boolean;
// }



// interface FollowUser {
//   id: string;
//   username: string;
// }

// interface FollowResponse {
//   users: FollowUser[];
//   totalCount: number;
// }


// // API Configuration
// const API_BASE_URL = 'http://172.50.5.102:3011';

// // API Functions
// const getAuthToken = () => {
//   return localStorage.getItem('instagram_user') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ4OWFlNzFkYzQ1NGZkYTkwYmE1MzciLCJlbWFpbCI6ImdhdXJhdkBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiZGV2aWNlSWQiOiJkZXZpY2UtMmZlaDI4YW1nLTE3NTA4MzA2MjA3MTYiLCJpcEFkZHJlc3MiOiIxNC4xOTQuMjIuMjAyIiwidXNlckFnZW50IjoiTW96aWxsYS81LjAgKExpbnV4OyBBbmRyb2lkIDYuMDsgTmV4dXMgNSBCdWlsZC9NUkE1OE4pIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzYuMC4wLjAgTW9iaWxlIFNhZmFyaS81MzcuMzYiLCJmY21Ub2tlbiI6ImRvaXNBcV9TVnd1T0xSNFNrem5zeGc6QVBBOTFiRjM4ZU4wZEdHaFVqbGZOdnR2QmtBMFRPeG9oLWRCZ0xPdzI4TTcxWkhIVGp1QWliMWQ5LXZxZ21oNU5GNDFQb3ZBWmlMN1JGWk1zbGR5ZGdpX0M3Si1JY0pGS0xkSTE2SG50ZTdYV1N6Ujo4elBQLWsiLCJpYXQiOjE3NTA4MzA2MjEsImV4cCI6MTc1MDkxNzAyMSwic3ViIjoiNjg0ODlhZTcxZGM0NTRmZGE5MGJhNTM3In0.W9VoUyrSNVV1nuyS3m_hEf9KBlS8qImSHAlXpJ7tCyc';
// };

// const fetchUserProfile = async (): Promise<User> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/users/profile`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${getAuthToken()}`,
//       },
//       timeout: 10000,
//     });
//     const data = response.data;
//     return {
//       id: data._id,
//       username: data.username,
//       fullName: data.fullName,
//       email: data.email,
//       bio: data.bio,
//       profilePicture: data.profilePicture,
//       followersCount: data.followersCount,
//       followingCount: data.followingCount,
//       postsCount: data.posts?.length || 0,
//       isFollowing: false,
//       isPrivate: data.isPrivate,
//       isVerified: false,
//       website: undefined,
//       accountType: data.accountType,
//       isActive: data.isActive,
//     };
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       if (error.response?.status === 401) throw new Error('Authentication required. Please log in.');
//       if (error.response?.status === 404) throw new Error('User profile not found.');
//       if (error.response?.status >= 500) throw new Error('Server error. Please try again later.');
//       if (error.code === 'ECONNABORTED') throw new Error('Request timeout. Please check your connection.');
//     }
//     throw new Error('Failed to load profile. Please check your connection.');
//   }
// };

// const fetchFollowing = async (page: number = 1): Promise<FollowResponse> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/users/me/following`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${getAuthToken()}`,
//       },
//       params: { page },
//     });
//     return {
//       users: response.data.users.map((u: any) => ({ id: u.id, username: u.username })),
//       totalCount: response.data.totalCount,
//     };
//   } catch (error) {
//     console.error('Error fetching following:', error);
//     throw new Error('Failed to load following list');
//   }
// };

// const fetchFollowers = async (page: number = 1): Promise<FollowResponse> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/users/me/followers`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${getAuthToken()}`,
//       },
//       params: { page },
//     });
//     return {
//       users: response.data.users.map((u: any) => ({ id: u._id || u.id, username: u.username })),
//       totalCount: response.data.totalCount,
//     };
//   } catch (error) {
//     console.error('Error fetching followers:', error);
//     throw new Error('Failed to load followers list');
//   }
// };

// // Helper function to generate avatar with user initials
// const generateAvatar = (username: string): string => {
//   const canvas = document.createElement('canvas');
//   const context = canvas.getContext('2d');
//   canvas.width = 150;
//   canvas.height = 150;
//   if (context) {
//     const gradient = context.createLinearGradient(0, 0, 150, 150);
//     gradient.addColorStop(0, '#667eea');
//     gradient.addColorStop(1, '#764ba2');
//     context.fillStyle = gradient;
//     context.fillRect(0, 0, 150, 150);
//     context.fillStyle = 'white';
//     context.font = '60px Arial';
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';
//     context.fillText(username.charAt(0).toUpperCase(), 75, 75);
//   }
//   return canvas.toDataURL();
// };

// // Follow Modal Component
// const FollowModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   type: 'followers' | 'following';
//   count: number;
// }> = ({ isOpen, onClose, type, count }) => {
//   const [users, setUsers] = useState<FollowUser[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const usersPerPage = 10;

//   useEffect(() => {
//     if (isOpen) {
//       const fetchUsers = async () => {
//         try {
//           setLoading(true);
//           setError(null);
//           const data = type === 'followers' ? await fetchFollowers(page) : await fetchFollowing(page);
//           setUsers(data.users);
//         } catch (err) {
//           setError(err instanceof Error ? err.message : 'Failed to load users');
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchUsers();
//     }
//   }, [isOpen, type, page]);

//   if (!isOpen) return null;

//   return (
//     <div className={styles.modalOverlay} onClick={onClose}>
//       <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//         <div className={styles.modalHeader}>
//           <h3 className={styles.modalTitle}>
//             {type === 'followers' ? 'Followers' : 'Following'} ({count})
//           </h3>
//           <button className={styles.closeButton} onClick={onClose}>
//             ✕
//           </button>
//         </div>
//         <div className={styles.modalContent}>
//           {loading ? (
//             <div className={styles.modalLoading}>
//               <div className={styles.modalSpinner}></div>
//             </div>
//           ) : error ? (
//             <div className={styles.emptyState}>
//               <p>{error}</p>
//             </div>
//           ) : users.length === 0 ? (
//             <div className={styles.emptyState}>
//               <div className={styles.emptyIcon}>👥</div>
//               <p>No {type} yet</p>
//             </div>
//           ) : (
//             users.map((user) => (
//               <div key={user.id} className={styles.userItem}>
//                 <div className={styles.userAvatar}>
//                   {user.username.charAt(0).toUpperCase()}
//                 </div>
//                 <div className={styles.userInfo}>
//                   <p className={styles.userUsername}>{user.username}</p>
//                 </div>
//               </div>
//             ))
//           )}
//           {count > usersPerPage && (
//             <div className={styles.pagination}>
//               <button
//                 className={styles.button}
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page === 1}
//               >
//                 Previous
//               </button>
//               <button
//                 className={styles.button}
//                 onClick={() => setPage((p) => p + 1)}
//                 disabled={page * usersPerPage >= count}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Profile Header Component
// const ProfileHeader: React.FC<{
//   user: User;
//   isOwnProfile: boolean;
//   onFollowToggle: () => void;
//   isFollowLoading: boolean;
//   onFollowersClick: () => void;
//   onFollowingClick: () => void;
// }> = ({ user, isOwnProfile, onFollowToggle, isFollowLoading, onFollowersClick, onFollowingClick }) => (
//   <div className={styles.profileHeader}>
//     <div className={styles.profilePictureContainer}>
//       <img
//         src={user.profilePicture || generateAvatar(user.username)}
//         alt={user.username}
//         className={styles.profilePicture}
//         onError={(e) => {
//           (e.target as HTMLImageElement).src = generateAvatar(user.username);
//         }}
//       />
//     </div>
//     <div className={styles.profileInfo}>
//       <div className={styles.usernameSection}>
//         <h1 className={styles.username}>
//           {user.username}
//           {user.isVerified && (
//             <svg className={styles.verifiedBadge} fill="currentColor" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           )}
//         </h1>
//         <span className={`${styles.accountType} ${user.accountType === 'public' ? styles.accountTypePublic : styles.accountTypePrivate}`}>
//           {user.accountType}
//         </span>
//         {isOwnProfile ? (
//           <button className={styles.button}>Edit Profile</button>
//         ) : (
//           <button
//             className={`${styles.button} ${user.isFollowing ? '' : styles.followButton}`}
//             style={{ opacity: isFollowLoading ? 0.6 : 1, cursor: isFollowLoading ? 'not-allowed' : 'pointer' }}
//             onClick={onFollowToggle}
//             disabled={isFollowLoading}
//           >
//             {isFollowLoading ? 'Loading...' : (user.isFollowing ? 'Following' : 'Follow')}
//           </button>
//         )}
//       </div>
//       <div className={styles.stats}>
//         <div className={styles.stat}>
//           <span className={styles.statNumber}>{user.postsCount.toLocaleString()}</span>
//           <span className={styles.statLabel}>posts</span>
//         </div>
//         <div
//           className={`${styles.stat} ${user.followersCount > 0 ? '' : styles.noCursor}`}
//           onClick={user.followersCount > 0 ? onFollowersClick : undefined}
//         >
//           <span className={styles.statNumber}>{user.followersCount.toLocaleString()}</span>
//           <span className={styles.statLabel}>followers</span>
//         </div>
//         <div
//           className={`${styles.stat} ${user.followingCount > 0 ? '' : styles.noCursor}`}
//           onClick={user.followingCount > 0 ? onFollowingClick : undefined}
//         >
//           <span className={styles.statNumber}>{user.followingCount.toLocaleString()}</span>
//           <span className={styles.statLabel}>following</span>
//         </div>
//       </div>
//       <div className={styles.bio}>
//         <p className={styles.fullName}>{user.fullName}</p>
//         <p className={styles.email}>{user.email}</p>
//         <p className={styles.bioText}>{user.bio}</p>
//         {user.website && (
//           <a
//             href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
//             className={styles.website}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             {user.website}
//           </a>
//         )}
//       </div>
//     </div>
//   </div>
// );

// // Main Profile Page Component
// const ProfilePage: React.FC = () => {
//   const { userId } = useParams<{ userId?: string }>();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [followLoading, setFollowLoading] = useState(false);
//   const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);

//   const isOwnProfile = true;

//   // Setup auth token
//   useEffect(() => {
//     if (!localStorage.getItem('authToken')) {
//       localStorage.setItem('authToken', getAuthToken());
//     }
//   }, []);

//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const userData = await fetchUserProfile();
//         setUser(userData);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to load profile');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Handle follow/unfollow
//   const handleFollowToggle = async () => {
//     if (!user || isOwnProfile) return;
//     // Follow functionality would go here
//   };

//   // Modal handlers
//   const handleFollowersClick = () => setModalType('followers');
//   const handleFollowingClick = () => setModalType('following');
//   const handleCloseModal = () => setModalType(null);

//   if (loading) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.content}>
//           <div className={styles.loading}>
//             <div className={styles.spinner}></div>
//             <p>Loading profile...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !user) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.content}>
//           <div className={styles.errorState}>
//             <div className={styles.emptyIcon}>⚠️</div>
//             <h3>Oops! Something went wrong</h3>
//             <p>{error || 'User not found'}</p>
//             <button className={styles.retryButton} onClick={() => window.location.reload()}>
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.content}>
//         <div className={styles.apiBanner}>
//           ✅ Real API Data: {user.username} | Followers: {user.followersCount} | Following: {user.followingCount} | Click on counts to see lists!
//         </div>
//         <ProfileHeader
//           user={user}
//           isOwnProfile={isOwnProfile}
//           onFollowToggle={handleFollowToggle}
//           isFollowLoading={followLoading}
//           onFollowersClick={handleFollowersClick}
//           onFollowingClick={handleFollowingClick}
//         />
//         <div className={styles.sections}>
//           <div className={styles.tabs}>
//             <button className={styles.tab}>
//               <span>⊞</span>
//               <span>POSTS</span>
//             </button>
//           </div>
//           <div className={styles.emptyState}>
//             <div className={styles.emptyIcon}>📷</div>
//             <h3>No Posts Yet</h3>
//             <p>Posts will appear here when available from API</p>
//           </div>
//         </div>
//       </div>
//       <FollowModal
//         isOpen={modalType !== null}
//         onClose={handleCloseModal}
//         type={modalType || 'followers'}
//         count={modalType === 'followers' ? user.followersCount : user.followingCount}
//       />
//     </div>
//   );
// };

// export default ProfilePage;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import styles from './ProfilePage.module.css';

// // Types
// interface User {
//   id: string;
//   username: string;
//   fullName: string;
//   email: string;
//   bio: string;
//   profilePicture: string;
//   followersCount: number;
//   followingCount: number;
//   postsCount: number;
//   isFollowing: boolean;
//   isPrivate: boolean;
//   isVerified?: boolean;
//   website?: string;
//   accountType: string;
//   isActive: boolean;
// }

// interface Post {
//   id: string;
//   imageUrl: string;
//   likesCount: number;
//   commentsCount: number;
//   caption?: string;
//   createdAt: string;
//   isVideo?: boolean;
// }

// interface FollowUser {
//   id: string;
//   username: string;
// }

// interface FollowResponse {
//   users: FollowUser[];
//   totalCount: number;
// }

// interface TaggedPostResponse {
//   posts: {
//     _id: string;
//     UserId: string;
//     content: string;
//     media: string[];
//     visibility: string;
//     keywords: string[];
//     taggedUsers: string[];
//     deleted: boolean;
//     moderated: boolean;
//     isReported: boolean;
//     reportReason: string | null;
//     reportCount: number;
//     taggedUsersInfo: any[];
//     reportHistory: any[];
//     createdAt: string;
//     updatedAt: string;
//     reactionCount?: number;
//     commentCount?: number;
//     username?: string;
//     fullName?: string;
//     mediaUrl?: string;
//   }[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// // API Configuration
// const API_BASE_URL = 'http://172.50.5.102:3011';

// // API Functions
// const getAuthToken = () => {
//   return localStorage.getItem('instagram_user') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ4OWFlNzFkYzQ1NGZkYTkwYmE1MzciLCJlbWFpbCI6ImdhdXJhdkBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiZGV2aWNlSWQiOiJkZXZpY2UtMmZlaDI4YW1nLTE3NTA4MzA2MjA3MTYiLCJpcEFkZHJlc3MiOiIxNC4xOTQuMjIuMjAyIiwidXNlckFnZW50IjoiTW96aWxsYS81LjAgKExpbnV4OyBBbmRyb2lkIDYuMDsgTmV4dXMgNSBCdWlsZC9NUkE1OE4pIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzYuMC4wLjAgTW9iaWxlIFNhZmFyaS81MzcuMzYiLCJmY21Ub2tlbiI6ImRvaXNBcV9TVnd1T0xSNFNrem5zeGc6QVBBOTFiRjM4ZU4wZEdHaFVqbGZOdnR2QmtBMFRPeG9oLWRCZ0xPdzI4TTcxWkhIVGp1QWliMWQ5LXZxZ21oNU5GNDFQb3ZBWmlMN1JGWk1zbGR5ZGdpX0M3Si1JY0pGS0xkSTE2SG50ZTdYV1N6Ujo4elBQLWsiLCJpYXQiOjE3NTA4MzA2MjEsImV4cCI6MTc1MDkxNzAyMSwic3ViIjoiNjg0ODlhZTcxZGM0NTRmZGE5MGJhNTM3In0.W9VoUyrSNVV1nuyS3m_hEf9KBlS8qImSHAlXpJ7tCyc';
// };

// const fetchUserProfile = async (): Promise<User> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/users/profile`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${getAuthToken()}`,
//       },
//       timeout: 10000,
//     });
//     const data = response.data;
//     return {
//       id: data._id,
//       username: data.username,
//       fullName: data.fullName,
//       email: data.email,
//       bio: data.bio,
//       profilePicture: data.profilePicture,
//       followersCount: data.followersCount,
//       followingCount: data.followingCount,
//       postsCount: data.posts?.length || 0,
//       isFollowing: false,
//       isPrivate: data.isPrivate,
//       isVerified: false,
//       website: undefined,
//       accountType: data.accountType,
//       isActive: data.isActive,
//     };
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       if (error.response?.status === 401) throw new Error('Authentication required. Please log in.');
//       if (error.response?.status === 404) throw new Error('User profile not found.');
//       if (error.response?.status >= 500) throw new Error('Server error. Please try again later.');
//       if (error.code === 'ECONNABORTED') throw new Error('Request timeout. Please check your connection.');
//     }
//     throw new Error('Failed to load profile. Please check your connection.');
//   }
// };

// const fetchFollowing = async (page: number = 1): Promise<FollowResponse> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/users/me/following`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${getAuthToken()}`,
//       },
//       params: { page },
//     });
//     return {
//       users: response.data.users.map((u: any) => ({ id: u.id, username: u.username })),
//       totalCount: response.data.totalCount,
//     };
//   } catch (error) {
//     console.error('Error fetching following:', error);
//     throw new Error('Failed to load following list');
//   }
// };

// const fetchFollowers = async (page: number = 1): Promise<FollowResponse> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/posts/me/followers`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${getAuthToken()}`,
//       },
    
//     });
//     return {
//       users: response.data.users.map((u: any) => ({ id: u._id || u.id, username: u.username })),
//       totalCount: response.data.totalCount,
//     };
//   } catch (error) {
//     console.error('Error fetching followers:', error);
//     throw new Error('Failed to load followers list');
//   }
// };

// const fetchTaggedPosts = async (): Promise<Post[]> => {
//   try {
//     const response = await axios.get(`http://172.50.5.102:3000/posts/tagged`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${getAuthToken()}`,
//       },
//       timeout: 10000,
//     });
//     const data: TaggedPostResponse = response.data;
//     return data.posts.map(post => ({
//       id: post._id,
//       imageUrl: post.media[0] ? `http://172.50.5.102:3000/${post.media[0]}` : 'https://via.placeholder.com/300x300?text=Image',
//       likesCount: post.reactionCount || 0,
//       commentsCount: post.commentCount || 0,
//       caption: post.content,
//       createdAt: post.createdAt,
//       isVideo: false,
//     }));
//   } catch (error) {
//     console.error('Error fetching tagged posts:', error);
//     throw new Error('Failed to load tagged posts');
//   }
// };

// const fetchSavedPosts = async (): Promise<Post[]> => {
//   try {
//     const response = await axios.get(`http://172.50.5.102:3000/posts/saved`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${getAuthToken()}`,
//       },
//       timeout: 10000,
//     });
//     // Placeholder: Transform response if API is fixed
//     return [];
//   } catch (error) {
//     console.error('Error fetching saved posts:', error);
//     throw new Error('Saved posts are currently unavailable due to a server error');
//   }
// };

// // Helper function to generate avatar with user initials
// const generateAvatar = (username: string): string => {
//   const canvas = document.createElement('canvas');
//   const context = canvas.getContext('2d');
//   canvas.width = 150;
//   canvas.height = 150;
//   if (context) {
//     const gradient = context.createLinearGradient(0, 0, 150, 150);
//     gradient.addColorStop(0, '#667eea');
//     gradient.addColorStop(1, '#764ba2');
//     context.fillStyle = gradient;
//     context.fillRect(0, 0, 150, 150);
//     context.fillStyle = 'white';
//     context.font = '60px Arial';
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';
//     context.fillText(username.charAt(0).toUpperCase(), 75, 75);
//   }
//   return canvas.toDataURL();
// };

// // Follow Modal Component
// const FollowModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   type: 'followers' | 'following';
//   count: number;
// }> = ({ isOpen, onClose, type, count }) => {
//   const [users, setUsers] = useState<FollowUser[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const usersPerPage = 10;

//   useEffect(() => {
//     if (isOpen) {
//       const fetchUsers = async () => {
//         try {
//           setLoading(true);
//           setError(null);
//           const data = type === 'followers' ? await fetchFollowers(page) : await fetchFollowing(page);
//           setUsers(data.users);
//         } catch (err) {
//           setError(err instanceof Error ? err.message : 'Failed to load users');
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchUsers();
//     }
//   }, [isOpen, type, page]);

//   if (!isOpen) return null;

//   return (
//     <div className={styles.modalOverlay} onClick={onClose}>
//       <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//         <div className={styles.modalHeader}>
//           <h3 className={styles.modalTitle}>
//             {type === 'followers' ? 'Followers' : 'Following'} ({count})
//           </h3>
//           <button className={styles.closeButton} onClick={onClose}>
//             ✕
//           </button>
//         </div>
//         <div className={styles.modalContent}>
//           {loading ? (
//             <div className={styles.modalLoading}>
//               <div className={styles.modalSpinner}></div>
//             </div>
//           ) : error ? (
//             <div className={styles.emptyState}>
//               <p>{error}</p>
//             </div>
//           ) : users.length === 0 ? (
//             <div className={styles.emptyState}>
//               <div className={styles.emptyIcon}>👥</div>
//               <p>No {type} yet</p>
//             </div>
//           ) : (
//             users.map((user) => (
//               <div key={user.id} className={styles.userItem}>
//                 <div className={styles.userAvatar}>
//                   {user.username.charAt(0).toUpperCase()}
//                 </div>
//                 <div className={styles.userInfo}>
//                   <p className={styles.userUsername}>{user.username}</p>
//                 </div>
//               </div>
//             ))
//           )}
//           {count > usersPerPage && (
//             <div className={styles.pagination}>
//               <button
//                 className={styles.button}
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page === 1}
//               >
//                 Previous
//               </button>
//               <button
//                 className={styles.button}
//                 onClick={() => setPage((p) => p + 1)}
//                 disabled={page * usersPerPage >= count}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Posts Grid Component
// const PostsGrid: React.FC<{
//   posts: Post[];
//   isPrivate: boolean;
//   isFollowing: boolean;
//   isOwnProfile: boolean;
//   isLoading?: boolean;
//   error?: string | null;
// }> = ({ posts, isPrivate, isFollowing, isOwnProfile, isLoading, error }) => {
//   const [hoveredPost, setHoveredPost] = useState<string | null>(null);

//   if (isLoading) {
//     return (
//       <div className={styles.loading}>
//         <div className={styles.spinner}></div>
//         <p>Loading posts...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.emptyState}>
//         <div className={styles.emptyIcon}>⚠️</div>
//         <h3>Error</h3>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   if (isPrivate && !isFollowing && !isOwnProfile) {
//     return (
//       <div className={styles.emptyState}>
//         <div className={styles.emptyIcon}>🔒</div>
//         <h3>This Account is Private</h3>
//         <p>Follow to see their posts</p>
//       </div>
//     );
//   }

//   if (posts.length === 0) {
//     return (
//       <div className={styles.emptyState}>
//         <div className={styles.emptyIcon}>📷</div>
//         <h3>No Posts Yet</h3>
//         {isOwnProfile && <p>Share a photo to get started</p>}
//       </div>
//     );
//   }

//   return (
//     <div className={styles.postsGrid}>
//       {posts.map((post) => (
//         <div
//           key={post.id}
//           className={styles.postItem}
//           onMouseEnter={() => setHoveredPost(post.id)}
//           onMouseLeave={() => setHoveredPost(null)}
//         >
//           <img
//             src={post.imageUrl}
//             alt="Post"
//             className={styles.postImage}
//             style={{
//               transform: hoveredPost === post.id ? 'scale(1.05)' : 'scale(1)',
//             }}
//             loading="lazy"
//             onError={(e) => {
//               (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Image';
//             }}
//           />
//           <div
//             className={styles.postOverlay}
//             style={{
//               opacity: hoveredPost === post.id ? 1 : 0,
//             }}
//           >
//             <div className={styles.postStats}>
//               <span>❤️ {post.likesCount.toLocaleString()}</span>
//               <span>💬 {post.commentsCount.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// // Profile Header Component
// const ProfileHeader: React.FC<{
//   user: User;
//   isOwnProfile: boolean;
//   onFollowToggle: () => void;
//   isFollowLoading: boolean;
//   onFollowersClick: () => void;
//   onFollowingClick: () => void;
// }> = ({ user, isOwnProfile, onFollowToggle, isFollowLoading, onFollowersClick, onFollowingClick }) => (
//   <div className={styles.profileHeader}>
//     <div className={styles.profilePictureContainer}>
//       <img
//         src={user.profilePicture || generateAvatar(user.username)}
//         alt={user.username}
//         className={styles.profilePicture}
//         onError={(e) => {
//           (e.target as HTMLImageElement).src = generateAvatar(user.username);
//         }}
//       />
//     </div>
//     <div className={styles.profileInfo}>
//       <div className={styles.usernameSection}>
//         <h1 className={styles.username}>
//           {user.username}
//           {user.isVerified && (
//             <svg className={styles.verifiedBadge} fill="currentColor" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           )}
//         </h1>
//         <span className={`${styles.accountType} ${user.accountType === 'public' ? styles.accountTypePublic : styles.accountTypePrivate}`}>
//           {user.accountType}
//         </span>
//         {isOwnProfile ? (
//           <button className={styles.button}>Edit Profile</button>
//         ) : (
//           <button
//             className={`${styles.button} ${user.isFollowing ? '' : styles.followButton}`}
//             style={{ opacity: isFollowLoading ? 0.6 : 1, cursor: isFollowLoading ? 'not-allowed' : 'pointer' }}
//             onClick={onFollowToggle}
//             disabled={isFollowLoading}
//           >
//             {isFollowLoading ? 'Loading...' : (user.isFollowing ? 'Following' : 'Follow')}
//           </button>
//         )}
//       </div>
//       <div className={styles.stats}>
//         <div className={styles.stat}>
//           <span className={styles.statNumber}>{user.postsCount.toLocaleString()}</span>
//           <span className={styles.statLabel}>posts</span>
//         </div>
//         <div
//           className={`${styles.stat} ${user.followersCount > 0 ? '' : styles.noCursor}`}
//           onClick={user.followersCount > 0 ? onFollowersClick : undefined}
//         >
//           <span className={styles.statNumber}>{user.followersCount.toLocaleString()}</span>
//           <span className={styles.statLabel}>followers</span>
//         </div>
//         <div
//           className={`${styles.stat} ${user.followingCount > 0 ? '' : styles.noCursor}`}
//           onClick={user.followingCount > 0 ? onFollowingClick : undefined}
//         >
//           <span className={styles.statNumber}>{user.followingCount.toLocaleString()}</span>
//           <span className={styles.statLabel}>following</span>
//         </div>
//       </div>
//       <div className={styles.bio}>
//         <p className={styles.fullName}>{user.fullName}</p>
//         <p className={styles.email}>{user.email}</p>
//         <p className={styles.bioText}>{user.bio}</p>
//         {user.website && (
//           <a
//             href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
//             className={styles.website}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             {user.website}
//           </a>
//         )}
//       </div>
//     </div>
//   </div>
// );

// // Main Profile Page Component
// const ProfilePage: React.FC = () => {
//   const { userId } = useParams<{ userId?: string }>();
//   const [user, setUser] = useState<User | null>(null);
//   const [taggedPosts, setTaggedPosts] = useState<Post[]>([]);
//   const [savedPosts, setSavedPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [taggedLoading, setTaggedLoading] = useState(true);
//   const [savedLoading, setSavedLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [taggedError, setTaggedError] = useState<string | null>(null);
//   const [savedError, setSavedError] = useState<string | null>(null);
//   const [followLoading, setFollowLoading] = useState(false);
//   const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);
//   const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');

//   const isOwnProfile = true;

//   // Setup auth token
//   useEffect(() => {
//     if (!localStorage.getItem('authToken')) {
//       localStorage.setItem('authToken', getAuthToken());
//     }
//   }, []);

//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setTaggedLoading(true);
//         setSavedLoading(true);
//         setError(null);
//         setTaggedError(null);
//         setSavedError(null);

//         const userData = await fetchUserProfile();
//         setUser(userData);

//         const taggedData = await fetchTaggedPosts();
//         setTaggedPosts(taggedData);

//         try {
//           const savedData = await fetchSavedPosts();
//           setSavedPosts(savedData);
//         } catch (err) {
//           setSavedError(err instanceof Error ? err.message : 'Failed to load saved posts');
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to load profile');
//         setTaggedError('Failed to load tagged posts');
//         setSavedError('Saved posts are currently unavailable');
//       } finally {
//         setLoading(false);
//         setTaggedLoading(false);
//         setSavedLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Handle follow/unfollow
//   const handleFollowToggle = async () => {
//     if (!user || isOwnProfile) return;
//     // Follow functionality would go here
//   };

//   // Modal handlers
//   const handleFollowersClick = () => setModalType('followers');
//   const handleFollowingClick = () => setModalType('following');
//   const handleCloseModal = () => setModalType(null);

//   if (loading) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.content}>
//           <div className={styles.loading}>
//             <div className={styles.spinner}></div>
//             <p>Loading profile...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !user) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.content}>
//           <div className={styles.errorState}>
//             <div className={styles.emptyIcon}>⚠️</div>
//             <h3>Oops! Something went wrong</h3>
//             <p>{error || 'User not found'}</p>
//             <button className={styles.retryButton} onClick={() => window.location.reload()}>
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.content}>
//         <div className={styles.apiBanner}>
//           ✅ Real API Data: {user.username} | Followers: {user.followersCount} | Following: {user.followingCount} | Click on counts to see lists!
//         </div>
//         <ProfileHeader
//           user={user}
//           isOwnProfile={isOwnProfile}
//           onFollowToggle={handleFollowToggle}
//           isFollowLoading={followLoading}
//           onFollowersClick={handleFollowersClick}
//           onFollowingClick={handleFollowingClick}
//         />
//         <div className={styles.sections}>
//           <div className={styles.tabs}>
//             <button
//               className={`${styles.tab} ${activeTab === 'posts' ? styles.activeTab : ''}`}
//               onClick={() => setActiveTab('posts')}
//             >
//               <span>⊞</span>
//               <span>POSTS</span>
//             </button>
//             <button
//               className={`${styles.tab} ${activeTab === 'saved' ? styles.activeTab : ''}`}
//               onClick={() => setActiveTab('saved')}
//             >
//               <span>💾</span>
//               <span>SAVED</span>
//             </button>
//             <button
//               className={`${styles.tab} ${activeTab === 'tagged' ? styles.activeTab : ''}`}
//               onClick={() => setActiveTab('tagged')}
//             >
//               <span>🏷️</span>
//               <span>TAGGED</span>
//             </button>
//           </div>
//           {activeTab === 'posts' && (
//             <div className={styles.emptyState}>
//               <div className={styles.emptyIcon}>📷</div>
//               <h3>No Posts Yet</h3>
//               <p>Posts will appear here when available from API</p>
//             </div>
//           )}
//           {activeTab === 'saved' && (
//             <PostsGrid
//               posts={savedPosts}
//               isPrivate={user.isPrivate}
//               isFollowing={user.isFollowing}
//               isOwnProfile={isOwnProfile}
//               isLoading={savedLoading}
//               error={savedError}
//             />
//           )}
//           {activeTab === 'tagged' && (
//             <PostsGrid
//               posts={taggedPosts}
//               isPrivate={user.isPrivate}
//               isFollowing={user.isFollowing}
//               isOwnProfile={isOwnProfile}
//               isLoading={taggedLoading}
//               error={taggedError}
//             />
//           )}
//         </div>
//       </div>
//       <FollowModal
//         isOpen={modalType !== null}
//         onClose={handleCloseModal}
//         type={modalType || 'followers'}
//         count={modalType === 'followers' ? user.followersCount : user.followingCount}
//       />
//     </div>
//   );
// };

// export default ProfilePage;































// ProfilePg.tsx - Dark Theme Instagram Profile
import React, { useState, useEffect } from 'react';
import { User, Post, fetchUserProfile, fetchTaggedPosts } from './api';
import { ProfileHeader, PostsGrid, FollowModal, ProfileTabs } from './components';
import { EditProfileModal } from './EditProfileModal';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [taggedPosts, setTaggedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'tagged'>('posts');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>('followers');
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadProfile();
    loadTaggedPosts();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userData = await fetchUserProfile();
      setUser(userData);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadTaggedPosts = async () => {
    try {
      setPostsLoading(true);
      const posts = await fetchTaggedPosts();
      setTaggedPosts(posts);
    } catch (err) {
      console.error('Failed to load tagged posts:', err);
    } finally {
      setPostsLoading(false);
    }
  };

  // Modal handlers
  const handleFollowersClick = () => {
    setModalType('followers');
    setModalOpen(true);
  };

  const handleFollowingClick = () => {
    setModalType('following');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Edit profile handlers
  const handleEditProfile = () => {
    setEditModalOpen(true);
  };

  const handleSaveProfile = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
      // Here you would typically make an API call to save the changes
      console.log('Saving profile changes:', updatedUser);
    }
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return <PostsGrid posts={[]} emptyMessage="No Posts Yet" />;
      case 'reels':
        return (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎬</div>
            <h3>No Reels Yet</h3>
            <p>Create your first reel to get started!</p>
          </div>
        );
      case 'tagged':
        return <PostsGrid posts={taggedPosts} loading={postsLoading} emptyMessage="No Tagged Posts" />;
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.emptyIcon}>⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error || 'User not found'}</p>
          <button className={styles.retryButton} onClick={loadProfile}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
          onEditProfile={handleEditProfile}
        />

        {/* Profile Tabs */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {renderTabContent()}
        </div>
      </div>

      {/* Follow Modal */}
      <FollowModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        type={modalType}
        count={modalType === 'followers' ? user.followersCount : user.followingCount}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfilePage;