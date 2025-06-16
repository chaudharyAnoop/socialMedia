import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Search, PlusSquare, Heart, MessageCircle, Camera } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Instagram</h1>
          
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
            />
          </div>

          <nav className={styles.nav}>
            <button className={styles.navButton}>
              <Home />
            </button>
            <button className={styles.navButton}>
              <MessageCircle />
            </button>
            <button className={styles.navButton}>
              <PlusSquare />
            </button>
            <button className={styles.navButton}>
              <Heart />
            </button>
            <button 
              className={styles.profileButton}
              title={user?.fullName || 'Profile'}
            >
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                getInitials(user?.fullName || 'U')
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.welcomeCard}>
          <h2 className={styles.welcomeTitle}>Welcome to Instagram</h2>
          <p className={styles.welcomeSubtitle}>
            Start sharing your moments with the world
          </p>
          
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                getInitials(user?.fullName || 'User')
              )}
            </div>
            <div className={styles.userDetails}>
              <h3>@{user?.username}</h3>
              <p>{user?.fullName}</p>
              {user?.bio && <p>{user.bio}</p>}
            </div>
          </div>

          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className={styles.feedPlaceholder}>
          <Camera />
          <h3>No posts yet</h3>
          <p>When you share photos, they'll appear on your profile.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;