// components/common/Avatar/Avatar.tsx
import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  hasStory?: boolean;
  isStoryViewed?: boolean;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'medium', 
  hasStory = false, 
  isStoryViewed = false,
  onClick 
}) => {
  const sizeClass = styles[size];
  const storyClass = hasStory ? (isStoryViewed ? styles.storyViewed : styles.storyUnviewed) : '';
  
  return (
    <div 
      className={`${styles.avatarContainer} ${sizeClass} ${storyClass}`}
      onClick={onClick}
    >
      <div className={styles.avatarInner}>
        <img
          src={src}
          alt={alt}
          className={styles.avatarImage}
        />
      </div>
    </div>
  );
};

export default Avatar;