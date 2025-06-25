import   {ReactNode} from "react";


export interface NotificationData {
    id: string;
    type: 'like' | 'follow' | 'comment' | 'mention'; 
    user: {
      username: string;
      avatar: string | ReactNode;
    };
    content?: string;
    post?:string | {
      image: string;
    };
    timestamp: string;
    isRead: boolean;
    isFollowing?: boolean;
  }
  