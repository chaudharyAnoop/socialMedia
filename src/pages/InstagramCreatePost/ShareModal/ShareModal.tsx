import React from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './ShareModal.module.css';
import MediaCarousel from '../MediaCarousel/MediaCarousel';
import TagInput from '../TagInput/TagInput';

interface SelectedMedia {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface TaggedPerson {
  id: string;
  name: string;
}

interface ShareModalProps {
  selectedMedia: SelectedMedia[];
  caption: string;
  setCaption: React.Dispatch<React.SetStateAction<string>>;
  taggedPeople: TaggedPerson[];
  setTaggedPeople: React.Dispatch<React.SetStateAction<TaggedPerson[]>>;
  onBack: () => void;
  onShare: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  selectedMedia,
  caption,
  setCaption,
  taggedPeople,
  setTaggedPeople,
  onBack,
  onShare
}) => {
  return (
    <div className={styles.modal}>
      <div className={styles.shareModal}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <button
            onClick={onBack}
            className={styles.modalHeaderButton}
          >
            <ArrowLeft size={24} color="#6b7280" />
          </button>
          <h3 className={styles.modalTitle}>Share</h3>
          <button
            onClick={onShare}
            className={styles.modalHeaderButtonRight}
          >
            Share
          </button>
        </div>

        {/* Modal Content */}
        <div className={styles.shareContent}>
          {/* Image Preview */}
          <div className={styles.shareImageContainer}>
            <MediaCarousel
              selectedMedia={selectedMedia}
              setSelectedMedia={() => {}}
              shareMode
            />
          </div>
          
          {/* Caption and Options */}
          <div className={styles.shareOptions}>
            {/* User Info */}
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}></div>
              <span className={styles.username}>your_username</span>
            </div>
            
            {/* Caption */}
            <div className={styles.captionContainer}>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className={styles.captionInput}
                maxLength={2200}
              />
            </div>
            
            <div className={styles.captionCounter}>
              {caption.length}/2,200
            </div>
            
            {/* Tagged People */}
            <TagInput
              taggedPeople={taggedPeople}
              setTaggedPeople={setTaggedPeople}
            />
            
            {/* Share Options */}
            {/* <div className={styles.shareOptionsList}>
              <div className={styles.shareOption}>
                <div className={styles.shareOptionLeft}>
                  <MapPin size={16} />
                  <span className={styles.shareOptionLabel}>Add location</span>
                </div>
                <button className={styles.shareOptionButton}>
                  Add
                </button>
              </div>
              
              <div className={styles.shareOption}>
                <div className={styles.shareOptionLeft}>
                  <Music size={16} />
                  <span className={styles.shareOptionLabel}>Add music</span>
                </div>
                <button className={styles.shareOptionButton}>
                  Add
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;