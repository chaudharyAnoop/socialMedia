import React, { useState } from 'react';
import { X ,ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './MediaCarousel.module.css';

interface SelectedMedia {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface MediaCarouselProps {
  selectedMedia: SelectedMedia[];
  setSelectedMedia: React.Dispatch<React.SetStateAction<SelectedMedia[]>>;
  onAddMore?: () => void;
  shareMode?: boolean;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({
  selectedMedia,
  setSelectedMedia,
  shareMode = false
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // const removeMedia = (index: number): void => {
  //   setSelectedMedia(prev => {
  //     const newMedia = prev.filter((_, i) => i !== index);
  //     if (currentMediaIndex >= newMedia.length) {
  //       setCurrentMediaIndex(Math.max(0, newMedia.length - 1));
  //     }
  //     return newMedia;
  //   });
  // };

  const removeMedia = (index: number): void => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(selectedMedia[index].preview);
    
    setSelectedMedia(prev => {
      const newMedia = prev.filter((_, i) => i !== index);
      if (currentMediaIndex >= newMedia.length) {
        setCurrentMediaIndex(Math.max(0, newMedia.length - 1));
      }
      return newMedia;
    });
  };

  const nextMedia = (): void => {
    setCurrentMediaIndex(prev => 
      prev < selectedMedia.length - 1 ? prev + 1 : prev
    );
  };

  const prevMedia = (): void => {
    setCurrentMediaIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  return (
    <div className={styles.mediaContainer}>
      {/* Media Carousel */}
      <div className={styles.mediaCarousel}>
        <div className={styles.mediaFrame}>
          {selectedMedia[currentMediaIndex]?.type === 'image' ? (
            <img
              src={selectedMedia[currentMediaIndex]?.preview}
              alt="Selected"
              className={styles.mediaItem}
            />
          ) : (
            <video
              src={selectedMedia[currentMediaIndex]?.preview}
              className={styles.mediaItem}
              controls
            />
          )}
        </div>
        
        {/* Navigation Arrows */}
        {selectedMedia.length > 1 && (
          <>
            {currentMediaIndex > 0 && (
              <button
                onClick={prevMedia}
                className={styles.navButtonLeft}
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {currentMediaIndex < selectedMedia.length - 1 && (
              <button
                onClick={nextMedia}
                className={styles.navButtonRight}
              >
                <ChevronRight size={20} />
              </button>
            )}
          </>
        )}
        
        {/* Media Counter */}
        {selectedMedia.length > 1 && !shareMode && (
          <div className={styles.mediaCounter}>
            {currentMediaIndex + 1}/{selectedMedia.length}
          </div>
        )}
        
        {/* Remove Button */}
        {!shareMode && (
          <button
            onClick={() => removeMedia(currentMediaIndex)}
            className={styles.removeButton}
          >
            <X size={10} />
          </button>
        )}
      </div>
      
      {/* Thumbnail Strip */}
      {selectedMedia.length > 1 && !shareMode && (
        <div className={styles.thumbnailStrip}>
          {selectedMedia.map((media, index) => (
            <button
              key={index}
              onClick={() => setCurrentMediaIndex(index)}
              className={`${styles.thumbnail} ${index === currentMediaIndex ? styles.thumbnailActive : ''}`}
            >
              {media.type === 'image' ? (
                <img
                  src={media.preview}
                  alt={`Thumbnail ${index + 1}`}
                  className={styles.thumbnailImage}
                />
              ) : (
                <video
                  src={media.preview}
                  className={styles.thumbnailImage}
                />
              )}
            </button>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default MediaCarousel;