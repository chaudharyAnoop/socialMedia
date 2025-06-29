import React, { DragEvent , useState } from 'react';
import { Upload } from 'lucide-react';
import styles from './DropZone.module.css';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  openFileSelector: () => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected, openFileSelector }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  return (
    <div
      className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileSelector}
    >
      <div className={styles.uploadIcon}>
        <Upload size={28} color="white" />
      </div>
      <h4 className={styles.uploadTitle}>
        Drag photos and videos here
      </h4>
      <p className={styles.uploadText}>
        Select from your computer
      </p>
      <button
        className={styles.uploadButton}
      >
        Select from computer
      </button>
    </div>
  );
};

export default DropZone;