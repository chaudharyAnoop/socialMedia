import React from 'react';
import styles from '../FormInput/FormInput.module.css';

interface PasswordStrengthProps {
  password: string;
}

export type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

export const calculatePasswordStrength = (password: string): {
  level: PasswordStrengthLevel;
  score: number;
  feedback: string;
} => {
  if (!password) {
    return { level: 'weak', score: 0, feedback: '' };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('One number');
  }

  // Special character check
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One special character');
  }

  let level: PasswordStrengthLevel;
  let message: string;

  if (score <= 1) {
    level = 'weak';
    message = 'Weak password';
  } else if (score <= 2) {
    level = 'fair';
    message = 'Fair password';
  } else if (score <= 3) {
    level = 'good';
    message = 'Good password';
  } else {
    level = 'strong';
    message = 'Strong password';
  }

  return {
    level,
    score,
    feedback: feedback.length > 0 ? `Missing: ${feedback.join(', ')}` : message,
  };
};

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const { level, score, feedback } = calculatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className={styles.passwordStrength}>
      <span className={styles.strengthLabel}>Password strength</span>
      <div className={styles.strengthBar}>
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={`${styles.strengthSegment} ${
              segment <= score ? styles[level] : ''
            }`}
          />
        ))}
      </div>
      <div className={`${styles.strengthText} ${styles[level]}`}>
        {feedback}
      </div>
    </div>
  );
};

export default PasswordStrength;