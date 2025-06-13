import React from 'react';
import styles from './ImagePreview.module.css';

interface ImagePreviewProps {
  imageUrl: string;
  caption: string;
  onCaptionChange: (caption: string) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  caption,
  onCaptionChange,
}) => {
  return (
    <div className={styles.imagePreview}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt="Selected" className={styles.image} />
      </div>
      
      <div className={styles.captionGroup}>
        <label className={styles.captionLabel}>Caption</label>
        <div className={styles.textareaContainer}>
          <textarea 
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            placeholder="Write a caption..."
            className={styles.captionInput}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ImagePreview);