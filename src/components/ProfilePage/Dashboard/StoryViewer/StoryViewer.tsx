// components/StoryViewer/StoryViewer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, MoreHorizontal, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import type { Story, UserProfile } from '../../../types';
import Avatar from '../../common/Avatar/Avatar';
import styles from './StoryViewer.module.css';

interface StoryViewerProps {
  stories: Story[];
  currentStoryIndex: number;
  profile: UserProfile;
  onClose: () => void;
  onStoryChange: (index: number) => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  currentStoryIndex,
  profile,
  onClose,
  onStoryChange
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState('');
  const progressRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentStory = stories[currentStoryIndex];
  const STORY_DURATION = 15000; // 15 seconds

  useEffect(() => {
    startProgress();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentStoryIndex, isPaused]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(!isPaused);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPaused, currentStoryIndex]);

  const startProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    progressRef.current = 0;
    setProgress(0);

    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        progressRef.current += 100;
        const newProgress = (progressRef.current / STORY_DURATION) * 100;
        setProgress(newProgress);

        if (newProgress >= 100) {
          handleNext();
        }
      }, 100);
    }
  };

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      onStoryChange(currentStoryIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      onStoryChange(currentStoryIndex - 1);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message, 'to story:', currentStory.id);
      setMessage('');
    }
  };

  const handleAreaClick = (e: React.MouseEvent, area: 'left' | 'right' | 'center') => {
    e.stopPropagation();
    if (area === 'left' && currentStoryIndex > 0) {
      handlePrevious();
    } else if (area === 'right') {
      handleNext();
    } else if (area === 'center') {
      handlePauseResume();
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {/* Progress bars */}
        <div className={styles.progressContainer}>
          {stories.map((_, index) => (
            <div key={index} className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{
                  width: index < currentStoryIndex ? '100%' : 
                         index === currentStoryIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <Avatar
              src={profile.profileImage}
              alt={profile.fullName}
              size="small"
            />
            <span className={styles.username}>{profile.username}</span>
            <span className={styles.timeAgo}>2h</span>
          </div>
          <div className={styles.headerActions}>
            {currentStory.isVideo && (
              <button 
                className={styles.muteButton}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className={styles.icon} /> : <Volume2 className={styles.icon} />}
              </button>
            )}
            <button className={styles.pauseButton} onClick={handlePauseResume}>
              {isPaused ? <Play className={styles.icon} /> : <Pause className={styles.icon} />}
            </button>
            <button className={styles.moreButton}>
              <MoreHorizontal className={styles.icon} />
            </button>
            <button className={styles.closeButton} onClick={onClose}>
              <X className={styles.icon} />
            </button>
          </div>
        </div>

        {/* Story content */}
        <div className={styles.content}>
          <div 
            className={styles.leftArea}
            onClick={(e) => handleAreaClick(e, 'left')}
          />
          <div 
            className={styles.centerArea}
            onClick={(e) => handleAreaClick(e, 'center')}
          >
            {currentStory.isVideo ? (
              <video
                ref={videoRef}
                src={currentStory.imageUrl}
                className={styles.media}
                autoPlay
                muted={isMuted}
                loop
                onLoadedData={() => videoRef.current?.play()}
              />
            ) : (
              <img
                src={currentStory.imageUrl}
                alt="Story"
                className={styles.media}
              />
            )}
          </div>
          <div 
            className={styles.rightArea}
            onClick={(e) => handleAreaClick(e, 'right')}
          />
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.reactionArea}>
            <button 
              className={`${styles.heartButton} ${liked ? styles.liked : ''}`}
              onClick={() => setLiked(!liked)}
            >
              <Heart className={styles.heartIcon} />
            </button>
          </div>
          <div className={styles.messageArea}>
            <input
              type="text"
              placeholder="Send message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className={styles.messageInput}
            />
            <button 
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className={styles.sendIcon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;