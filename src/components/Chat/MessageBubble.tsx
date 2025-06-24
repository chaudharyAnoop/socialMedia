import { useEffect, useState } from 'react';
import { Message } from './types';
import styles from './MessageBubble.module.css';
import { socketService } from '../../services/socketService';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);
 useEffect(()=>{
 setEditedText(message.text)
 },[message])
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleEdit = () => {
    if (editedText.trim()) {
      socketService.editMessage(message.id, editedText);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    socketService.deleteMessage(message.id);
    setEditedText('')
  };

  return (
    <div className={`${styles.container} ${isOwn ? styles.containerOwn : styles.containerOther}`}>
      <div className={`${styles.messageWrapper} ${isOwn ? styles.messageWrapperOwn : styles.messageWrapperOther}`}>
        {isEditing ? (
          <div>
            <input
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
              className={styles.messageInput}
            />
            <button onClick={handleEdit} className={styles.actionButton}>
              Save
            </button>
            <button onClick={() => {
              setIsEditing(false)
              setEditedText(message.text)
            }} className={styles.actionButton}>
              Cancel
            </button>
          </div>
        ) : (
          <div
            className={`${styles.messageBubble} ${
              isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther
            }`}
          >
            <p className={styles.messageText}>{editedText?editedText:"This message is deleted"}</p>
            {isOwn && (
              <div className={styles.actionButtons}>
              {editedText &&<><button onClick={() => setIsEditing(true)} className={styles.actionButton}>
                  Edit
                </button>
                <button onClick={handleDelete} className={styles.actionButton}>
                  Delete
                </button></>}
              </div>
            )}
          </div>
        )}
        <div className={`${styles.timestamp} ${isOwn ? styles.timestampOwn : styles.timestampOther}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;