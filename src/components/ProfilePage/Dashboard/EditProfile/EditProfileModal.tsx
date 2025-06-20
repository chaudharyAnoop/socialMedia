// components/EditProfile/EditProfileModal.tsx
import React, { useState, useRef } from 'react';
import { X, Camera, Upload } from 'lucide-react';
import type { UserProfile } from '../../../../types';
import Avatar from '../../common/Avatar/Avatar';
import Button from '../../common/Button/Button';
import styles from './EditProfileModal.module.css';

interface EditProfileModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    username: profile.username,
    bio: profile.bio,
    website: profile.website || '',
    profileImage: profile.profileImage
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          profileImage: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={onClose}>
            <X className={styles.closeIcon} />
          </button>
          <h2 className={styles.title}>Edit profile</h2>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={isLoading}
            className={styles.saveButton}
          >
            {isLoading ? 'Saving...' : 'Done'}
          </Button>
        </div>

        <div className={styles.content}>
          <div className={styles.profileImageSection}>
            <div className={styles.avatarContainer}>
              <Avatar
                src={formData.profileImage}
                alt={formData.fullName}
                size="large"
              />
              <button 
                className={styles.changePhotoButton}
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className={styles.cameraIcon} />
              </button>
            </div>
            <div className={styles.imageActions}>
              <h3 className={styles.usernameTitle}>{formData.username}</h3>
              <button 
                className={styles.changePhotoText}
                onClick={() => fileInputRef.current?.click()}
              >
                Change profile photo
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.hiddenInput}
            />
          </div>

          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={styles.input}
                placeholder="Name"
              />
              <span className={styles.helpText}>
                Help people discover your account by using the name you're known by: either your full name, nickname, or business name.
              </span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={styles.input}
                placeholder="Username"
              />
              <span className={styles.helpText}>
                In most cases, you'll be able to change your username back to {profile.username} for another 14 days.
              </span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className={styles.input}
                placeholder="Website"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className={styles.textarea}
                placeholder="Bio"
                rows={3}
                maxLength={150}
              />
              <span className={styles.characterCount}>
                {formData.bio.length}/150
              </span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Personal information</label>
              <span className={styles.helpText}>
                Provide your personal information, even if the account is used for a business, a pet or something else. This won't be part of your public profile.
              </span>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  value="john.doe@example.com"
                  className={styles.input}
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone number</label>
                <input
                  type="tel"
                  value="+1 (555) 123-4567"
                  className={styles.input}
                  disabled
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Gender</label>
                <select className={styles.select}>
                  <option>Prefer not to say</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;