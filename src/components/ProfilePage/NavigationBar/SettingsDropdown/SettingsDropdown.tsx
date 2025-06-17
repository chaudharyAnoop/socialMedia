// components/SettingsDropdown/SettingsDropdown.tsx
import React, { useEffect, useRef } from 'react';
import { 
  Settings, 
  Activity, 
  QrCode, 
  Bookmark, 
  Moon, 
  AlertCircle, 
  LogOut,
  User,
  Bell,
  Globe
} from 'lucide-react';
import styles from './SettingsDropdown.module.css';

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (action: string) => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  isOpen,
  onClose,
  onItemClick
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: Settings, label: 'Settings', action: 'settings' },
    { icon: Activity, label: 'Your activity', action: 'activity' },
    { icon: QrCode, label: 'QR code', action: 'qr-code' },
    { icon: Bookmark, label: 'Saved', action: 'saved' },
    { icon: Moon, label: 'Switch appearance', action: 'appearance' },
    { icon: AlertCircle, label: 'Report a problem', action: 'report' },
    { 
      icon: User, 
      label: 'Switch accounts', 
      action: 'switch-accounts',
      divider: true 
    },
    { icon: LogOut, label: 'Log out', action: 'logout' }
  ];

  return (
    <div className={styles.backdrop}>
      <div 
        ref={dropdownRef}
        className={styles.dropdown}
      >
        {menuItems.map((item, index) => (
          <React.Fragment key={item.action}>
            {item.divider && <div className={styles.divider} />}
            <button
              className={styles.menuItem}
              onClick={() => {
                onItemClick(item.action);
                onClose();
              }}
            >
              <item.icon className={styles.icon} />
              <span className={styles.label}>{item.label}</span>
            </button>
          </React.Fragment>
        ))}
        
        <div className={styles.divider} />
        
        <button
          className={styles.cancelButton}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SettingsDropdown;