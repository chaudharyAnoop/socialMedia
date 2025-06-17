
import React from 'react';
import { useToast } from '../../../../../../../igdummy/src/hooks/useToast';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import styles from './ToastContainer.module.css';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className={styles.icon} />;
      case 'error':
        return <AlertCircle className={styles.icon} />;
      default:
        return <Info className={styles.icon} />;
    }
  };

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`${styles.toast} ${styles[toast.type]}`}
        >
          {getIcon(toast.type)}
          <span className={styles.message}>{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)}
            className={styles.closeButton}
            aria-label="Close notification"
          >
            <X className={styles.closeIcon} />
          </button>
        </div>
      ))}
    </div>
  );
};