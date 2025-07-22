// data/mockData.ts - Updated with Better Posts
import type { UserProfile, Story, Post, Highlight, Comment } from '../types';

export const mockProfile: UserProfile = {
  id: 'user_123',
  username: 'johndoe_photographer',
  fullName: 'John Doe',
  bio: '📸 Professional Photographer\n🌍 Travel Enthusiast\n✨ Capturing moments that matter\n📍 Based in New York',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  postsCount: 24,
  followersCount: 15400,
  followingCount: 892,
  isVerified: true,
  isPrivate: false,
  website: 'johndoephotography.com'
};

export const mockStories: Story[] = [
  { 
    id: '1',
    username: 'johndoe_photographer',
    profileImage: mockProfile.profileImage,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop', 
    title: 'Nature', 
    isViewed: false,
    isVideo: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isOwn: true
  },
  { 
    id: '2',
    username: 'johndoe_photographer', 
    profileImage: mockProfile.profileImage,
    imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=600&fit=crop', 
    title: 'City', 
    isViewed: true,
    isVideo: true,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isOwn: true
  },
  { 
    id: '3',
    username: 'johndoe_photographer',
    profileImage: mockProfile.profileImage, 
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop', 
    title: 'Travel', 
    isViewed: false,
    isVideo: false,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    isOwn: true
  }
];

export const mockHighlights: Highlight[] = [
  {
    id: '1',
    title: 'Travel',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=80&h=80&fit=crop',
    storiesCount: 12,
    stories: []
  },
  {
    id: '2',
    title: 'Work',
    coverImage: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=80&h=80&fit=crop',
    storiesCount: 8,
    stories: []
  },
  {
    id: '3',
    title: 'Food',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&fit=crop',
    storiesCount: 15,
    stories: []
  }
];

// Better posts with real photography images
export const mockPosts: Post[] = [
  {
    id: 'post-1',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    caption: 'Golden hour magic at the lake 🌅 One of those moments that reminds you why you fell in love with photography. The way the light danced on the water was absolutely mesmerizing. #goldenhour #naturephotography #landscape #reflection',
    location: 'Lake Tahoe, California',
    likes: 2847,
    comments: 156,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-2',
    imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=400&fit=crop',
    caption: 'Street vibes in downtown NYC 🏙️ Love the energy of this city! #streetphotography #nyc #urban #citylife',
    location: 'New York, NY',
    likes: 1923,
    comments: 89,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-3',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop',
    caption: 'Morning coffee and creativity ☕️✨ Starting the day right with some planning for upcoming shoots. What fuels your creativity? #morningvibes #coffee #photographer #workspace',
    likes: 1456,
    comments: 67,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-4',
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop',
    caption: 'Adventure awaits! 🏔️ Sometimes you have to get lost to find the most beautiful places. This hike was absolutely worth every step. #adventure #mountains #hiking #naturelover',
    location: 'Rocky Mountain National Park',
    likes: 3251,
    comments: 198,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-5',
    imageUrl: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=400&fit=crop',
    caption: 'Behind the scenes of today\'s portrait session 📸 Love working with natural light and authentic expressions. Model: @sarah_model #bts #portraitphotography #naturallight #photoshoot',
    likes: 2109,
    comments: 143,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isVideo: true,
    videoDuration: 15
  },
  {
    id: 'post-6',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
    caption: 'Food photography session for @localbistro 🍽️ Amazing how lighting can make food look absolutely irresistible! #foodphotography #commercial #restaurant #delicious',
    location: 'Local Bistro, Manhattan',
    likes: 1687,
    comments: 92,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-7',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    caption: 'Into the forest 🌲 There\'s something magical about being surrounded by nature. The peace, the sounds, the fresh air... pure therapy. #forest #nature #peaceful #meditation',
    likes: 2456,
    comments: 87,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-8',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    caption: 'City lights and night vibes ✨ Love how the city transforms after dark. Every light tells a story. #nightphotography #cityscape #lights #urban',
    location: 'Manhattan, NY',
    likes: 3456,
    comments: 234,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-9',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop',
    caption: 'Sunset over the mountains 🏔️ Sometimes nature puts on the most incredible show. Grateful to witness moments like these. #sunset #mountains #grateful #naturephotography',
    likes: 4123,
    comments: 287,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-10',
    imageUrl: 'https://images.unsplash.com/photo-1418489098061-ce87b5dc3aee?w=400&h=400&fit=crop',
    caption: 'Ocean therapy 🌊 Nothing beats the sound of waves and the smell of salt air. Perfect way to recharge and find inspiration. #ocean #therapy #waves #inspiration',
    location: 'Malibu, California',
    likes: 2890,
    comments: 167,
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-11',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    caption: 'Architecture and shadows 🏢 Love how light plays with structures throughout the day. This building caught my eye with its geometric beauty. #architecture #shadows #geometric #urban',
    likes: 1876,
    comments: 95,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-12',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    caption: 'Macro Monday! 🔍 Getting up close with nature reveals the most incredible details. This flower was absolutely stunning under the macro lens. #macro #flower #details #nature',
    likes: 2234,
    comments: 134,
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-13',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    caption: 'Black and white mood 🖤 Sometimes removing color helps you see the true emotion and composition. Classic never goes out of style. #blackandwhite #mood #classic #emotion',
    likes: 3167,
    comments: 201,
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-14',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    caption: 'Workshop prep! 📚 Getting ready for next week\'s photography workshop. So excited to share knowledge and learn from other creatives. #workshop #teaching #photography #community',
    likes: 1543,
    comments: 78,
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-15',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop',
    caption: 'New gear day! 📷 Just picked up this amazing lens. Can\'t wait to test it out on tomorrow\'s shoot. What\'s your favorite piece of gear? #newgear #lens #photography #excited',
    likes: 2678,
    comments: 189,
    timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    isVideo: false,
    isCarousel: true,
    media: [
      { id: '1', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop', type: 'image', aspectRatio: 1 },
      { id: '2', url: 'https://images.unsplash.com/photo-1418489098061-ce87b5dc3aee?w=400&h=400&fit=crop', type: 'image', aspectRatio: 1 }
    ]
  },
  {
    id: 'post-16',
    imageUrl: 'https://images.unsplash.com/photo-1418489098061-ce87b5dc3aee?w=400&h=400&fit=crop',
    caption: 'Client work: Brand photography for @amazingbrand 🎯 Love creating images that tell a brand\'s story. This session was all about capturing their innovative spirit. #brandphotography #client #commercial #storytelling',
    location: 'Studio, NYC',
    likes: 1987,
    comments: 112,
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-17',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    caption: 'Weekend escape 🚗 Sometimes you need to just drive and see where the road takes you. Found this amazing spot completely by accident! #roadtrip #escape #adventure #spontaneous',
    likes: 2345,
    comments: 156,
    timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    isVideo: false
  },
  {
    id: 'post-18',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    caption: 'Thank you all for 15K followers! 🙏 This journey has been incredible and I\'m so grateful for this amazing community. Here\'s to many more adventures together! #grateful #15k #community #thankyou',
    likes: 5678,
    comments: 432,
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    isVideo: false
  }
];

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