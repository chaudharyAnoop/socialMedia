// src/components/Notifications/types.ts
export interface NotificationData {
    id: string;
    type: 'like' | 'follow' | 'comment' | 'mention';
    user: {
      username: string;
      avatar: string;
    };
    content?: string;
    post?: {
      image: string;
    };
    timestamp: string;
    isRead: boolean;
    isFollowing?: boolean;
  }
  







  export const sampleNotifications: NotificationData[] = [
    {
        id: '1',
        type: 'like',
        user: { username: 'john_doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
        timestamp: '2h',
        isRead: false,
        post: { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop' }
      },
      {
        id: '2',
        type: 'follow',
        user: { username: 'sarah_wilson', avatar: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop' },
        timestamp: '5h',
        isRead: false
      },
      {
        id: '3',
        type: 'comment',
        user: { username: 'mike_johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
        content: 'Amazing shot! 📸',
        timestamp: '1d',
        isRead: false,
        post: { image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=150&h=150&fit=crop' }
      },
      {
        id: '4',
        type: 'like',
        user: { username: 'emma_davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
        timestamp: '2d',
        isRead: false,
        post: { image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=150&h=150&fit=crop' }
      },
      {
        id: '5',
        type: 'mention',
        user: { username: 'alex_brown', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
        content: 'mentioned you in a comment',
        timestamp: '3d',
        isRead: false,
        post: { image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=150&h=150&fit=crop' }
      },
      {
        id: '6',
        type: 'like',
        user: { username: 'lisa_wang', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face' },
        timestamp: '4d',
        isRead: false,
        post: { image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=150&h=150&fit=crop' }
      },

  ];