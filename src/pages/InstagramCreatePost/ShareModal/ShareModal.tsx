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
  content: string;
  visibility:String;
  setVisibility:any;
  setcontent: React.Dispatch<React.SetStateAction<string>>;
  taggedUsers: TaggedPerson[];
  settaggedUsers: React.Dispatch<React.SetStateAction<TaggedPerson[]>>;
  onBack: () => void;
  onShare: () => void;
}








const ShareModal: React.FC<ShareModalProps> = ({
  selectedMedia,
  content,
  setcontent,
  taggedUsers,
  settaggedUsers,
  visibility,
  setVisibility,
  onBack,
  onShare
}) => {


  const  addpublic = (): void => {
    setVisibility("public")
  };
  
  const  addprivate = (): void => {
    setVisibility("private");
  };
  




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
          
          {/* content and Options */}
          <div className={styles.shareOptions}>
            {/* User Info */}
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}></div>
              <span className={styles.username}>your_username</span>
            </div>
            
            {/* content */}
            <div className={styles.contentContainer}>
              <textarea
                value={content}
                onChange={(e) => setcontent(e.target.value)}
                placeholder="Write a content..."
                className={styles.contentInput}
                maxLength={2200}
              />
            </div>
            
            <div className={styles.contentCounter}>
              {content.length}/2,200
            </div>
            
            {/* Tagged People */}
            <TagInput
              taggedUsers={taggedUsers}
              settaggedUsers={settaggedUsers}
            />
            <button onClick={addpublic} >
              public 
            </button>
            <button onClick={addprivate}>
              private
            </button>
            
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