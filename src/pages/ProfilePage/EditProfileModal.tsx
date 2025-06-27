import React, { useState } from "react";
import { User } from "./api";

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <h2>Edit Profile</h2>
          <button onClick={handleSave} className="save-btn">
            Done
          </button>
        </div>

        <div className="edit-modal-content">
          <div className="profile-picture-section">
            <img
              src={currentAvatar}
              alt="Profile"
              className="edit-profile-pic"
            />
            <div className="profile-pic-actions">
              <label htmlFor="profile-pic-input" className="change-photo-btn">
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

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Name"
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
            />
          </div>

          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Website"
            />
          </div>

          <div className="form-group">
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

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .edit-modal {
          background: #262626;
          border-radius: 12px;
          width: 400px;
          max-height: 80vh;
          overflow: hidden;
          color: #fff;
        }

        .edit-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #363636;
        }

        .edit-modal-header h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .cancel-btn, .save-btn {
          background: none;
          border: none;
          color: #0095f6;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          padding: 8px;
        }

        .cancel-btn:hover, .save-btn:hover {
          color: #1877f2;
        }

        .edit-modal-content {
          padding: 20px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .profile-picture-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }

        .edit-profile-pic {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 12px;
        }

        .change-photo-btn {
          color: #0095f6;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
        }

        .change-photo-btn:hover {
          color: #1877f2;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 6px;
          color: #fff;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #363636;
          border-radius: 6px;
          background: #262626;
          color: #fff;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0095f6;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #8e8e8e;
        }

        @media (max-width: 480px) {
          .edit-modal {
            width: 90vw;
            margin: 20px;
          }
        }
      `}</style>
    </div>
  );
};
