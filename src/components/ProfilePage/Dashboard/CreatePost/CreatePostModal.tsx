// components/CreatePost/CreatePostModal.tsx
import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Video, ArrowLeft, MapPin, Users, Smile } from 'lucide-react';
import { UserProfile } from '../../../types';
import Avatar from '../../common/Avatar/Avatar';
import Button from '../../common/Button/Button';
import styles from './CreatePostModal.module.css';

interface CreatePostModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
  onPost: (postData: any) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  profile,
  onClose,
  onPost
}) => {
  const [step, setStep] = useState<'upload' | 'edit' | 'share'>('upload');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [altText, setAltText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setStep('edit');
  };

  const handlePost = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const postData = {
        id: `post-${Date.now()}`,
        imageUrl: previewUrls[0], // In real app, this would be uploaded URL
        caption,
        location,
        altText,
        likes: 0,
        comments: 0,
        timestamp: new Date(),
        isVideo: selectedFiles[0]?.type.startsWith('video/')
      };
      
      onPost(postData);
      onClose();
      resetModal();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setStep('upload');
    setSelectedFiles([]);
    setPreviewUrls([]);
    setCurrentImageIndex(0);
    setCaption('');
    setLocation('');
    setAltText('');
    previewUrls.forEach(url => URL.revokeObjectURL(url));
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'upload': return 'Create new post';
      case 'edit': return 'Edit';
      case 'share': return 'Share';
      default: return 'Create new post';
    }
  };

  const handleNext = () => {
    if (step === 'edit') {
      setStep('share');
    }
  };

  const handleBack = () => {
    if (step === 'share') {
      setStep('edit');
    } else if (step === 'edit') {
      setStep('upload');
      resetModal();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          {step !== 'upload' && (
            <button className={styles.backButton} onClick={handleBack}>
              <ArrowLeft className={styles.headerIcon} />
            </button>
          )}
          <h2 className={styles.title}>{getStepTitle()}</h2>
          {step === 'edit' && (
            <button className={styles.nextButton} onClick={handleNext}>
              Next
            </button>
          )}
          {step === 'share' && (
            <Button 
              variant="primary" 
              onClick={handlePost}
              disabled={isLoading}
              className={styles.shareButton}
            >
              {isLoading ? 'Sharing...' : 'Share'}
            </Button>
          )}
          <button className={styles.closeButton} onClick={handleClose}>
            <X className={styles.headerIcon} />
          </button>
        </div>

        <div className={styles.content}>
          {step === 'upload' && (
            <div className={styles.uploadArea}>
              <div className={styles.uploadIcon}>
                <ImageIcon size={96} />
              </div>
              <h3 className={styles.uploadTitle}>Drag photos and videos here</h3>
              <Button 
                variant="primary" 
                onClick={() => fileInputRef.current?.click()}
                className={styles.selectButton}
              >
                Select from computer
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className={styles.hiddenInput}
              />
            </div>
          )}

          {step === 'edit' && previewUrls.length > 0 && (
            <div className={styles.editArea}>
              <div className={styles.imagePreview}>
                {selectedFiles[currentImageIndex]?.type.startsWith('video/') ? (
                  <video
                    src={previewUrls[currentImageIndex]}
                    className={styles.previewMedia}
                    controls
                  />
                ) : (
                  <img
                    src={previewUrls[currentImageIndex]}
                    alt="Preview"
                    className={styles.previewMedia}
                  />
                )}
                
                {previewUrls.length > 1 && (
                  <div className={styles.imageNavigation}>
                    {previewUrls.map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.navDot} ${index === currentImageIndex ? styles.active : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'share' && (
            <div className={styles.shareArea}>
              <div className={styles.imagePreview}>
                {selectedFiles[currentImageIndex]?.type.startsWith('video/') ? (
                  <video
                    src={previewUrls[currentImageIndex]}
                    className={styles.previewMedia}
                    controls
                  />
                ) : (
                  <img
                    src={previewUrls[currentImageIndex]}
                    alt="Preview"
                    className={styles.previewMedia}
                  />
                )}
              </div>
              
              <div className={styles.shareForm}>
                <div className={styles.userInfo}>
                  <Avatar
                    src={profile.profileImage}
                    alt={profile.fullName}
                    size="small"
                  />
                  <span className={styles.username}>{profile.username}</span>
                </div>

                <div className={styles.formGroup}>
                  <textarea
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className={styles.captionTextarea}
                    maxLength={2200}
                  />
                  <div className={styles.captionFooter}>
                    <button className={styles.emojiButton}>
                      <Smile className={styles.emojiIcon} />
                    </button>
                    <span className={styles.characterCount}>
                      {caption.length}/2,200
                    </span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.inputWithIcon}>
                    <MapPin className={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="Add location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={styles.locationInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <details className={styles.advancedSettings}>
                    <summary className={styles.advancedToggle}>
                      Advanced settings
                    </summary>
                    <div className={styles.advancedContent}>
                      <label className={styles.label}>Alt text</label>
                      <input
                        type="text"
                        placeholder="Write alt text..."
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        className={styles.input}
                        maxLength={100}
                      />
                      <span className={styles.helpText}>
                        Alt text describes your photos for people with visual impairments.
                      </span>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;