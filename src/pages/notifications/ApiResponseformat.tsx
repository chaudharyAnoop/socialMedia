import { NotificationData } from './types';
import  {ReactNode} from 'react';
import {
  Heart,
  MessageCircle,
  UserPlus,
  AtSign
} from 'lucide-react';




export const formatNotification = (raw: any): NotificationData | null => {
  const allowedTypes = ['like', 'comment', 'follow', 'mention'];
  const type = raw.type.toLowerCase();

  if (!allowedTypes.includes(type)) return null;
  
  const iconMap: Record<string, ReactNode> = {
    like: <Heart size={25} color="#ef4444" />,           // red heart
    comment: <MessageCircle size={25} color="#3b82f6" />, // blue comment
    follow: <UserPlus size={25} color="#10b981" />,       // green follow
    mention: <AtSign size={25} color="#8b5cf6" />         // purple at-sign
  };

  return {
    id: raw._id,
    type,
    user: {
      
      username: raw.senderName || 'Unknown',
      avatar: iconMap[type] // default avatar
    },
    content: raw.content,
    post:  { image: 'https://picsum.photos/150' } ,
    timestamp: new Date(raw.createdAt).toLocaleString(),
    isRead: false,
    isFollowing: false
  };
};