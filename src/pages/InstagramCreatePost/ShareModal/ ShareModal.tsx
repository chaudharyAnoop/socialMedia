import React from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './ShareModal.module.css';

interface ShareModalProps {
  isOpen: boolean;
  imageUrl: string;
  caption: string;
  onClose: () => void;
  onShare: () => void;
  onBack: () => void;
  onCaptionChange: (caption: string) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  imageUrl,
  caption,
  onShare,
  onBack,
  onCaptionChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <button onClick={onBack} className={styles.closeButton}>
            <ArrowLeft size={24} color="#6b7280" />
          </button>
          <h3 className={styles.modalTitle}>Share</h3>
          <button onClick={onShare} className={styles.nextButton}>
            Share
          </button>
        </div>

        {/* Modal Content */}
        <div className={styles.shareModalContent}>
          {/* Image Preview */}
          <div className={styles.shareImagePreview}>
            <img src={imageUrl} alt="Preview" className={styles.image} />
          </div>
          
          {/* Caption and Options */}
          <div className={styles.shareCaptionArea}>
            <div className={styles.shareUserInfo}>
              <div className={styles.avatar}></div>
              <span className={styles.username}>your_username</span>
            </div>
            
            <div className={styles.captionContainer}>
              <textarea
                value={caption}
                onChange={(e) => onCaptionChange(e.target.value)}
                placeholder="Write a caption..."
                className={styles.shareCaptionInput}
                maxLength={2200}
              />
            </div>
            
            <div className={styles.characterCount}>
              {caption.length}/2,200
            </div>
            
            <div className={styles.shareOptions}>
              <div className={styles.shareOption}>
                <span className={styles.shareOptionLabel}>Add location</span>
                <button className={styles.shareOptionButton}>Add</button>
              </div>
              
              <div className={styles.shareOption}>
                <span className={styles.shareOptionLabel}>Tag people</span>
                <button className={styles.shareOptionButton}>Tag</button>
              </div>
              
              <div className={styles.shareOption}>
                <span className={styles.shareOptionLabel}>Add music</span>
                <button className={styles.shareOptionButton}>Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;