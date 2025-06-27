import React, { memo } from "react";

import { ArrowLeft } from "lucide-react";

import MediaCarousel from "../MediaCarousel/MediaCarousel";
import TagInput from "../TagInput/TagInput";

import styles from "./ShareModal.module.css";

interface SelectedMedia {
  file: File;
  preview: string;
  type: "image" | "video";
}

interface TaggedPerson {
  id: string;
  name: string;
}

interface ShareModalProps {
  selectedMedia: SelectedMedia[];
  content: string;
  visibility: string;
  setVisibility: (visibility: string) => void;
  setcontent: (content: string) => void;
  taggedUsers: TaggedPerson[];
  settaggedUsers: (users: TaggedPerson[]) => void;
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
  onShare,
}) => {
  return (
    <div className={styles.modal}>
      <div className={styles.shareModal}>
        <div className={styles.modalHeader}>
          <button onClick={onBack} className={styles.modalHeaderButton}>
            <ArrowLeft size={24} color="#6b7280" />
          </button>
          <h3 className={styles.modalTitle}>Share</h3>
          <button onClick={onShare} className={styles.modalHeaderButtonRight}>
            Share
          </button>
        </div>
        <div className={styles.shareContent}>
          <div className={styles.shareImageContainer}>
            <MediaCarousel
              selectedMedia={selectedMedia}
              setSelectedMedia={() => {}}
              shareMode
            />
          </div>
          <div className={styles.shareOptions}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}></div>
              <span className={styles.username}>yash rajput</span>
            </div>
            <div className={styles.contentContainer}>
              <textarea
                value={content}
                onChange={(e) => setcontent(e.target.value)}
                placeholder="Write a content..."
                className={styles.contentInput}
                maxLength={2200}
              />
            </div>
            <div className={styles.contentCounter}>{content.length}/2,200</div>
            <TagInput
              taggedUsers={taggedUsers}
              settaggedUsers={settaggedUsers}
            />
            <div className={styles.toggleButtonGroup}>
              <button
                className={`${styles.toggleButton} ${
                  visibility === "public" ? styles.active : ""
                }`}
                onClick={() => setVisibility("public")}
              >
                Public Post
              </button>
              <button
                className={`${styles.toggleButton} ${
                  visibility === "private" ? styles.active : ""
                }`}
                onClick={() => setVisibility("private")}
              >
                Private Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ShareModal);
