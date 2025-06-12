import React, { DragEvent } from 'react';
import { Upload } from 'lucide-react';
import styles from './UploadArea.module.css';

interface UploadAreaProps {
  isDragging: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}) => {
  return (
    <div
      className={isDragging ? styles.uploadAreaHover : styles.uploadArea}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
    >
      <div className={styles.uploadIconContainer}>
        <Upload size={32} color="white" />
      </div>
      <h4 className={styles.uploadTitle}>Drag photos and videos here</h4>
      <p className={styles.uploadSubtitle}>Select from your computer</p>
      <button className={styles.selectButton}>Select from computer</button>
    </div>
  );
};

export default React.memo(UploadArea);