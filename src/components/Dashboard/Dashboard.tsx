import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const getProviderBadge = (provider?: string) => {
    switch (provider) {
      case 'google':
        return '🔗 Google';
      case 'facebook':
        return '🔗 Facebook';
      case 'apple':
        return '🔗 Apple';
      default:
        return '📧 Email';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Instagram</h1>
        <div className={styles.userInfo}>
          {user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={`${user.username}'s profile`}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={16} />
            </div>
          )}
          <span className={styles.username}>@{user.username}</span>
          <button 
            className={styles.logoutButton}
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </header>

      <main className={styles.welcome}>
        <h2 className={styles.welcomeTitle}>
          Welcome to Instagram, {user.fullName}!
        </h2>
        <p className={styles.welcomeText}>
          Your account has been successfully created. This is a demo dashboard showing 
          your profile information.
        </p>

        <div className={styles.profileDetails}>
          <div className={styles.profileHeader}>
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={`${user.username}'s profile`}
                className={styles.profileAvatar}
              />
            ) : (
              <div className={styles.profileAvatarPlaceholder}>
                <User size={24} />
              </div>
            )}
            <div className={styles.profileInfo}>
              <h3>{user.fullName}</h3>
              <p>@{user.username}</p>
              <p className={styles.providerBadge}>
                {getProviderBadge(user.provider)}
              </p>
            </div>
          </div>
          {user.bio && (
            <div className={styles.bio}>
              {user.bio}
            </div>
          )}
        </div>

        <div className={styles.demoNote}>
          <h4>Demo Account</h4>
          <p>
            This is a demonstration of the authentication system. 
            To test login functionality, use: <strong>demo@instagram.com</strong> 
            with password: <strong>password123</strong>
          </p>
          <p style={{ marginTop: '8px', fontSize: '11px' }}>
            Social login buttons are functional and will create demo accounts with sample data.
          </p>
        </div>
      </main>
    </div>
  );
};