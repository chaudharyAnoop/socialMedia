// components/UnifiedStoriesHighlights.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import type { Story, Highlight } from '../../../types';

interface UnifiedStoriesHighlightsProps {
  stories: Story[];
  highlights: Highlight[];
  onStoryClick?: (story: Story, index: number) => void;
  onHighlightClick?: (highlight: Highlight) => void;
  onAddStory?: () => void;
  isOwnProfile?: boolean;
}

const UnifiedStoriesHighlights: React.FC<UnifiedStoriesHighlightsProps> = ({ 
  stories,
  highlights,
  onStoryClick,
  onHighlightClick,
  onAddStory,
  isOwnProfile = false
}) => {
  // Combine stories and highlights into one section
  const hasContent = stories.length > 0 || highlights.length > 0 || isOwnProfile;
  
  if (!hasContent) {
    return null;
  }

  return (
    <div style={styles.container}>
      {/* Stories Section */}
      {stories.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionWrapper}>
            {/* Add Story Button for own profile */}
            {isOwnProfile && (
              <div style={styles.addItem} onClick={onAddStory}>
                <div style={styles.addButton}>
                  <Plus style={styles.addIcon} />
                </div>
                <span style={styles.itemTitle}>New</span>
              </div>
            )}
            
            {/* Stories */}
            {stories.map((story, index) => (
              <div 
                key={story.id} 
                style={styles.storyItem}
                onClick={() => onStoryClick?.(story, index)}
              >
                <div style={{
                  ...styles.storyRing,
                  ...(story.isViewed ? styles.viewedRing : styles.unviewedRing)
                }}>
                  <div style={styles.storyImage}>
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      style={styles.image}
                    />
                    {story.isVideo && (
                      <div style={styles.videoIndicator}>
                        <div style={styles.playIcon}></div>
                      </div>
                    )}
                  </div>
                </div>
                <span style={styles.itemTitle}>{story.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Highlights Section */}
      {highlights.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionWrapper}>
            {highlights.map(highlight => (
              <div 
                key={highlight.id} 
                style={styles.highlightItem}
                onClick={() => onHighlightClick?.(highlight)}
              >
                <div style={styles.highlightRing}>
                  <div style={styles.highlightImage}>
                    <img
                      src={highlight.coverImage}
                      alt={highlight.title}
                      style={styles.image}
                    />
                  </div>
                </div>
                <span style={styles.itemTitle}>{highlight.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles object
const styles = {
  container: {
    background: 'var(--ig-primary-background)',
    borderBottom: '1px solid var(--ig-stroke)',
  } as React.CSSProperties,

  section: {
    padding: 'var(--ig-spacing-16) var(--ig-spacing-20) var(--ig-spacing-20)',
    borderBottom: '1px solid var(--ig-stroke)',
  } as React.CSSProperties,

  sectionWrapper: {
    display: 'flex',
    gap: 'var(--ig-spacing-20)',
    overflowX: 'auto' as const,
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    paddingBottom: 'var(--ig-spacing-4)',
  } as React.CSSProperties,

  // Story/Highlight Items
  storyItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 'var(--ig-spacing-8)',
    cursor: 'pointer',
    transition: 'transform var(--ig-animation-fast)',
    flexShrink: 0,
    minWidth: '64px',
  } as React.CSSProperties,

  highlightItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 'var(--ig-spacing-8)',
    cursor: 'pointer',
    transition: 'transform var(--ig-animation-fast)',
    flexShrink: 0,
    minWidth: '64px',
  } as React.CSSProperties,

  addItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 'var(--ig-spacing-8)',
    cursor: 'pointer',
    transition: 'transform var(--ig-animation-fast)',
    flexShrink: 0,
    minWidth: '64px',
  } as React.CSSProperties,

  // Story Rings (Instagram-style gradients)
  storyRing: {
    width: '66px',
    height: '66px',
    borderRadius: '50%',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
  } as React.CSSProperties,

  unviewedRing: {
    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
  } as React.CSSProperties,

  viewedRing: {
    background: 'var(--ig-stroke)',
  } as React.CSSProperties,

  storyImage: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '2px solid var(--ig-primary-background)',
    overflow: 'hidden',
    position: 'relative' as const,
    background: 'var(--ig-secondary-background)',
  } as React.CSSProperties,

  // Highlight Rings
  highlightRing: {
    width: '66px',
    height: '66px',
    borderRadius: '50%',
    border: '1px solid var(--ig-stroke)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--ig-primary-background)',
    transition: 'all var(--ig-animation-fast)',
  } as React.CSSProperties,

  highlightImage: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    overflow: 'hidden',
    background: 'var(--ig-secondary-background)',
  } as React.CSSProperties,

  // Add Button
  addButton: {
    width: '66px',
    height: '66px',
    borderRadius: '50%',
    border: '1px solid var(--ig-stroke)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--ig-primary-background)',
    transition: 'all var(--ig-animation-fast)',
  } as React.CSSProperties,

  addIcon: {
    width: '24px',
    height: '24px',
    color: 'var(--ig-secondary-text)',
    transition: 'color var(--ig-animation-fast)',
  } as React.CSSProperties,

  // Images
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    userSelect: 'none' as const,
    WebkitUserDrag: 'none' as const,
  } as React.CSSProperties,

  // Video Indicator
  videoIndicator: {
    position: 'absolute' as const,
    bottom: '2px',
    right: '2px',
    width: '16px',
    height: '16px',
    background: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,

  playIcon: {
    width: '0',
    height: '0',
    borderLeft: '4px solid #fff',
    borderTop: '2px solid transparent',
    borderBottom: '2px solid transparent',
    marginLeft: '1px',
  } as React.CSSProperties,

  // Titles
  itemTitle: {
    fontSize: 'var(--ig-font-size-caption)',
    color: 'var(--ig-primary-text)',
    maxWidth: '66px',
    textAlign: 'center' as const,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 'var(--ig-font-weight-normal)',
    lineHeight: '14px',
  } as React.CSSProperties,
};

export default UnifiedStoriesHighlights;