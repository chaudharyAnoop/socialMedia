// components/ProfileHeader/ProfileHeader.tsx
import React, { useState } from 'react';
import { MoreHorizontal, UserPlus, Settings, Plus } from 'lucide-react';
import type { UserProfile } from '../../../types';
import { formatNumber } from '../../../utils/formatters';
import Avatar from '../../common/Avatar/Avatar';
import Button from '../../common/Button/Button';
import SettingsDropdown from '../../NavigationBar/SettingsDropdown/SettingsDropdown';
import EditProfileModal from '../EditProfile/EditProfileModal';
import CreatePostModal from '../CreatePost/CreatePostModal';
import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
  profile: UserProfile;
  isFollowing: boolean;
  onFollowToggle: () => void;
  isOwnProfile?: boolean;
  onProfileUpdate?: (updatedProfile: Partial<UserProfile>) => void;
  onNewPost?: (postData: any) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profile, 
  isFollowing, 
  onFollowToggle,
  isOwnProfile = true,
  onProfileUpdate,
  onNewPost
}) => {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleSettingsClick = () => {
    setShowSettingsDropdown(true);
  };

  const handleSettingsItemClick = (action: string) => {
    console.log('Settings action:', action);
    switch (action) {
      case 'settings':
        console.log('Navigate to settings');
        break;
      case 'activity':
        console.log('Navigate to activity');
        break;
      case 'logout':
        console.log('Logout user');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const handleProfileSave = (updatedProfile: Partial<UserProfile>) => {
    console.log('Profile updated:', updatedProfile);
    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }
  };

  const handleNewPost = (postData: any) => {
    console.log('New post created:', postData);
    if (onNewPost) {
      onNewPost(postData);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.avatarSection}>
            <Avatar
              src={profile.profileImage}
              alt={profile.fullName}
              size="large"
            />
          </div>
          
          <div className={styles.infoSection}>
            <div className={styles.headerRow}>
              <div className={styles.usernameContainer}>
                <h1 className={styles.username}>{profile.username}</h1>
                {profile.isVerified && (
                  <svg className={styles.verifiedBadge} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <div className={styles.mobileActions}>
                  <button className={styles.mobileMoreButton} onClick={handleSettingsClick}>
                    <MoreHorizontal className={styles.icon} />
                  </button>
                </div>
              </div>
              
              <div className={styles.desktopActions}>
                {isOwnProfile ? (
                  <>
                    <Button variant="secondary" onClick={handleEditProfile}>
                      Edit Profile
                    </Button>
                    <Button variant="secondary">
                      View archive
                    </Button>
                    <Button variant="ghost" className={styles.iconButton} onClick={handleCreatePost}>
                      <Plus className={styles.icon} />
                    </Button>
                    <Button variant="ghost" className={styles.iconButton} onClick={handleSettingsClick}>
                      <Settings className={styles.icon} />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant={isFollowing ? 'secondary' : 'primary'}
                      onClick={onFollowToggle}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button variant="secondary">
                      Message
                    </Button>
                    <Button variant="ghost" className={styles.iconButton}>
                      <UserPlus className={styles.icon} />
                    </Button>
                    <Button variant="ghost" className={styles.iconButton} onClick={handleSettingsClick}>
                      <MoreHorizontal className={styles.icon} />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{formatNumber(profile.postsCount)}</span>
                <span className={styles.statLabel}>posts</span>
              </div>
              <button className={styles.stat}>
                <span className={styles.statNumber}>{formatNumber(profile.followersCount)}</span>
                <span className={styles.statLabel}>followers</span>
              </button>
              <button className={styles.stat}>
                <span className={styles.statNumber}>{formatNumber(profile.followingCount)}</span>
                <span className={styles.statLabel}>following</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className={styles.bioSection}>
          <div className={styles.fullName}>{profile.fullName}</div>
          <div className={styles.bio}>{profile.bio}</div>
          {profile.website && (
            <a 
              href={`https://${profile.website}`} 
              className={styles.website}
              target="_blank" 
              rel="noopener noreferrer"
            >
              {profile.website}
            </a>
          )}
        </div>

        {!isOwnProfile && (
          <div className={styles.mobileActionsRow}>
            <Button
              variant={isFollowing ? 'secondary' : 'primary'}
              onClick={onFollowToggle}
              className={styles.mobileButton}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            <Button variant="secondary" className={styles.mobileButton}>
              Message
            </Button>
            <Button variant="ghost" className={styles.mobileIconButton}>
              <UserPlus className={styles.icon} />
            </Button>
          </div>
        )}

        {isOwnProfile && (
          <div className={styles.mobileActionsRow}>
            <Button variant="secondary" className={styles.mobileButton} onClick={handleEditProfile}>
              Edit profile
            </Button>
            <Button variant="secondary" className={styles.mobileButton}>
              Share profile
            </Button>
            <Button variant="ghost" className={styles.mobileIconButton} onClick={handleCreatePost}>
              <Plus className={styles.icon} />
            </Button>
          </div>
        )}
      </div>

      <SettingsDropdown
        isOpen={showSettingsDropdown}
        onClose={() => setShowSettingsDropdown(false)}
        onItemClick={handleSettingsItemClick}
      />

      <EditProfileModal
        isOpen={showEditProfile}
        profile={profile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleProfileSave}
      />

      <CreatePostModal
        isOpen={showCreatePost}
        profile={profile}
        onClose={() => setShowCreatePost(false)}
        onPost={handleNewPost}
      />
    </>
  );
};

export default ProfileHeader;


