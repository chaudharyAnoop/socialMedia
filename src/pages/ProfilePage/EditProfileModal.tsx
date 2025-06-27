import React, { useState } from "react";
import { User } from "./api";
import styles from "./EditProfileModal.module.css";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    username: user.username,
    bio: user.bio,
    website: user.website || "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = () => {
    onSave({
      fullName: formData.fullName,
      username: formData.username,
      bio: formData.bio,
      website: formData.website,
      profilePicture: previewUrl || user.profilePicture,
    });
    onClose();
  };

  const currentAvatar =
    previewUrl ||
    user.profilePicture ||
    `https://ui-avatars.com/api/?name=${user.username}&background=333&color=fff&size=150`;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.editModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.editModalHeader}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <h2>Edit Profile</h2>
          <button onClick={handleSave} className={styles.saveBtn}>
            Done
          </button>
        </div>

        <div className={styles.editModalContent}>
          <div className={styles.profilePictureSection}>
            <img
              src={currentAvatar}
              alt="Profile"
              className={styles.editProfilePic}
            />
            <div className={styles.profilePicActions}>
              <label
                htmlFor="profile-pic-input"
                className={styles.changePhotoBtn}
              >
                Change profile photo
              </label>
              <input
                id="profile-pic-input"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Name"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Website"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Bio"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
