import React, { useRef } from 'react';
import { X } from 'lucide-react';
import styles from './CreatePostModal.module.css';
import UploadArea from '../UploadArea/UploadArea';
import ImagePreview from '../ImagePreview/ImagePreview';

interface SelectedImage {
  file: File;
  preview: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  selectedImage: SelectedImage | null;
  caption: string;
  isDragging: boolean;
  onClose: () => void;
  onNext: () => void;
  onFileSelect: (file: File) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onCaptionChange: (caption: string) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  selectedImage,
  caption,
  isDragging,
  onClose,
  onNext,
  onFileSelect,
  onDragOver,
  onDragLeave,
  onDrop,
  onCaptionChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} color="#6b7280" />
          </button>
          <h3 className={styles.modalTitle}>Create new post</h3>
          {selectedImage && (
            <button onClick={onNext} className={styles.nextButton}>
              Next
            </button>
          )}
        </div>

        <div>
          {!selectedImage ? (
            <>
              <UploadArea
                isDragging={isDragging}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={openFileSelector}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </>
          ) : (
            <ImagePreview
              imageUrl={selectedImage.preview}
              caption={caption}
              onCaptionChange={onCaptionChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CreatePostModal);