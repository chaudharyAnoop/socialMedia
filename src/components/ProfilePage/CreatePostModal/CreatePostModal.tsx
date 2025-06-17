// components/CreatePostModal/CreatePostModal.tsx - Create New Posts

import React, { useState } from 'react';
import { X, Upload, MapPin, Image as ImageIcon } from 'lucide-react';
import { usePosts } from '../../../../../../igdummy/src/contexts/AppContext';
import { useToast } from '../../../../../../igdummy/src/hooks/useToast';
import styles from './CreatePostModal.module.css';

interface CreatePostModalProps {
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose }) => {
  const { addPost } = usePosts();
  const { success } = useToast();
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelect(e.target.files);
    }
  };

  const handleImageSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    setSelectedImages(prev => [...prev, ...imageFiles].slice(0, 10)); // Max 10 images
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const createImageUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (selectedImages.length === 0) return;
    
    setIsCreating(true);
    
    try {
      // Convert files to URLs (in real app, upload to cloud storage)
      const mediaPromises = selectedImages.map(async (file, index) => {
        const url = await createImageUrl(file);
        return {
          id: `media_${Date.now()}_${index}`,
          url,
          type: 'image' as const,
          aspectRatio: 1,
          alt: `Uploaded image ${index + 1}`,
        };
      });
      
      const media = await Promise.all(mediaPromises);
      
      const newPost = {
        caption: caption.trim(),
        location: location.trim() || undefined,
        isCarousel: media.length > 1,
        media: media.length > 1 ? media : undefined,
        imageUrl: media.length === 1 ? media[0].url : undefined,
        isVideo: false,
        currentSlide: 0,
      };
      
      addPost(newPost);
      success('Post created successfully!');
      onClose();
      
    } finally {
      setIsCreating(false);
    }
  };

  const canCreate = selectedImages.length > 0 && !isCreating;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create New Post</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Image Upload Section */}
          <div className={styles.uploadSection}>
            {selectedImages.length === 0 ? (
              <div
                className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className={styles.uploadIcon} />
                <p className={styles.uploadText}>
                  Drag photos and videos here
                </p>
                <label className={styles.uploadButton}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className={styles.fileInput}
                  />
                  Select from computer
                </label>
              </div>
            ) : (
              <div className={styles.selectedImages}>
                {selectedImages.map((file, index) => (
                  <div key={index} className={styles.imagePreview}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Selected ${index + 1}`}
                      className={styles.previewImage}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className={styles.removeImage}
                    >
                      <X className={styles.removeIcon} />
                    </button>
                  </div>
                ))}
                
                {selectedImages.length < 10 && (
                  <label className={styles.addMore}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileInput}
                      className={styles.fileInput}
                    />
                    <ImageIcon className={styles.addIcon} />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Caption and Details */}
          {selectedImages.length > 0 && (
            <div className={styles.detailsSection}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className={styles.captionInput}
                  rows={4}
                  maxLength={2200}
                />
                <div className={styles.charCount}>
                  {caption.length}/2,200
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <MapPin className={styles.labelIcon} />
                  Add Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where was this photo taken?"
                  className={styles.locationInput}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={styles.shareButton}
            disabled={!canCreate}
          >
            {isCreating ? 'Creating...' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  );
};