// data/mockData.ts
import type { UserProfile, Story, Post, Highlight, Comment } from '../types';

export const mockProfile: UserProfile = {
  username: 'johndoe_photographer',
  fullName: 'John Doe',
  bio: '📸 Professional Photographer\n🌍 Travel Enthusiast\n✨ Capturing moments that matter\n📍 Based in New York',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  postsCount: 1247,
  followersCount: 15400,
  followingCount: 892,
  isVerified: true,
  isPrivate: false,
  website: 'johndoephotography.com'
};

export const mockStories: Story[] = [
  { 
    id: '1', 
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop', 
    title: 'Nature', 
    isViewed: false,
    isVideo: false
  },
  { 
    id: '2', 
    imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=600&fit=crop', 
    title: 'City', 
    isViewed: true,
    isVideo: true
  },
  { 
    id: '3', 
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop', 
    title: 'Travel', 
    isViewed: false,
    isVideo: false
  },
  { 
    id: '4', 
    imageUrl: 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400&h=600&fit=crop', 
    title: 'Studio', 
    isViewed: true,
    isVideo: false
  },
  { 
    id: '5', 
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop', 
    title: 'Work', 
    isViewed: false,
    isVideo: true
  }
];

export const mockHighlights: Highlight[] = [
  {
    id: '1',
    title: 'Travel',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=80&h=80&fit=crop',
    storiesCount: 12
  },
  {
    id: '2',
    title: 'Work',
    coverImage: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=80&h=80&fit=crop',
    storiesCount: 8
  },
  {
    id: '3',
    title: 'Food',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&fit=crop',
    storiesCount: 15
  },
  {
    id: '4',
    title: 'Friends',
    coverImage: 'https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?w=80&h=80&fit=crop',
    storiesCount: 23
  },
  {
    id: '5',
    title: 'Events',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=80&h=80&fit=crop',
    storiesCount: 7
  }
];

export const mockPosts: Post[] = Array.from({ length: 30 }, (_, i) => ({
  id: `post-${i}`,
  imageUrl: `https://images.unsplash.com/photo-${1500000000000 + i * 10000}?w=400&h=400&fit=crop`,
  likes: Math.floor(Math.random() * 5000) + 100,
  comments: Math.floor(Math.random() * 200) + 10,
  isVideo: Math.random() > 0.8,
  caption: [
    'Amazing sunset at the beach! 🌅 #photography #sunset #nature',
    'Coffee and creativity ☕️ #morningvibes #photographer #workspace',
    'Street photography in downtown NYC 🏙️ #streetphotography #nyc #urban',
    'Golden hour magic ✨ #goldenhour #portrait #photography',
    'Behind the scenes of today\'s shoot 📸 #bts #photographer #work',
    'Nature\'s beauty never ceases to amaze me 🌿 #nature #landscape #green',
    'Black and white portrait session 🖤 #bnw #portrait #studio',
    'Weekend adventures in the mountains ⛰️ #adventure #hiking #mountains',
    'Macro photography experiments 🔬 #macro #closeup #details',
    'Urban exploration continues 🏢 #urbex #architecture #city'
  ][i % 10],
  timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
}));

export const mockReels: Post[] = Array.from({ length: 18 }, (_, i) => ({
  id: `reel-${i}`,
  imageUrl: `https://images.unsplash.com/photo-${1600000000000 + i * 15000}?w=400&h=600&fit=crop`,
  likes: Math.floor(Math.random() * 10000) + 500,
  comments: Math.floor(Math.random() * 500) + 50,
  isVideo: true,
  caption: [
    'Behind the scenes magic ✨ #reels #photography #bts',
    'Quick editing tips for photographers 💡 #tips #editing #photoshop',
    'A day in the life of a photographer 📸 #dayinthelife #photographer',
    'Camera gear essentials 📷 #gear #camera #photography',
    'Street photography techniques 🏙️ #streetphotography #techniques',
    'Portrait lighting setup 💡 #portrait #lighting #studio',
    'Travel photography adventures ✈️ #travel #photography #adventure',
    'Drone shots from above 🚁 #drone #aerial #photography',
    'Time-lapse of photo editing ⏰ #timelapse #editing #workflow'
  ][i % 9],
  timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
}));

export const mockComments: Comment[] = [
  {
    id: '1',
    username: 'sarah_jones',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face',
    text: 'Amazing shot! 📸',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12
  },
  {
    id: '2',
    username: 'mike_photographer',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    text: 'What camera did you use for this? The colors are incredible! 🔥',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 8
  },
  {
    id: '3',
    username: 'emma_travels',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    text: 'This location looks amazing! Where was this taken?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    likes: 5
  },
  {
    id: '4',
    username: 'alex_creative',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    text: 'Love the composition! 👌',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    likes: 3
  },
  {
    id: '5',
    username: 'photo_enthusiast',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
    text: 'Incredible work as always! Keep inspiring us 🙌',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    likes: 15
  }
];

// Helper function to get random comments for posts
export const getRandomComments = (count: number = 3): Comment[] => {
  const shuffled = [...mockComments].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};