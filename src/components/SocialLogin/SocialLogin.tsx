import React from 'react';
import { Facebook } from 'lucide-react';
import styles from './SocialLogin.module.css';

interface SocialLoginProps {
  showForgotPassword?: boolean;
  onFacebookLogin?: () => void;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ 
  showForgotPassword = false,
  onFacebookLogin 
}) => {
  const handleFacebookLogin = () => {
    if (onFacebookLogin) {
      onFacebookLogin();
    } else {
      // Mock Facebook login
      alert('Facebook login would be implemented here');
    }
  };

  return (
    <div className={styles.socialContainer}>
      <div className={styles.divider}>
        <span>OR</span>
      </div>
      
      <button 
        type="button" 
        className={styles.socialButton}
        onClick={handleFacebookLogin}
      >
        <Facebook />
        Log in with Facebook
      </button>
      
      {showForgotPassword && (
        <div className={styles.forgotPassword}>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Forgotten your password?
          </a>
        </div>
      )}
    </div>
  );
};

export default SocialLogin;