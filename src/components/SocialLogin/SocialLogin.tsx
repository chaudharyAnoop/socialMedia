import React from "react";
import { Facebook } from "lucide-react";
import styles from "./SocialLogin.module.css";

interface SocialLoginProps {
  onFacebookLogin?: () => void;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ onFacebookLogin }) => {
  return (
    <div className={styles.socialLogin}>
      <div className={styles.divider}>
        <div className={styles.line}></div>
        <span className={styles.orText}>OR</span>
        <div className={styles.line}></div>
      </div>
      <button
        type="button"
        className={styles.facebookButton}
        onClick={onFacebookLogin}
      >
        <Facebook size={20} />
        <span>Log in with Facebook</span>
      </button>
    </div>
  );
};

export default SocialLogin;
