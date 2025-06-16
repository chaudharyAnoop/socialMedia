import React , { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import styles from './TagInput.module.css';

interface TaggedPerson {
  id: string;
  name: string;
}

interface TagInputProps {
  taggedUsers: TaggedPerson[];
  settaggedUsers: React.Dispatch<React.SetStateAction<TaggedPerson[]>>;
}

const TagInput: React.FC<TagInputProps> = ({ taggedUsers, settaggedUsers }) => {
  const [tagInput, setTagInput] = useState('');

  const addTaggedPerson = (): void => {
    if (tagInput.trim() && !taggedUsers.find(p => p.name === tagInput.trim())) {
      const newPerson: TaggedPerson = {
        id: Date.now().toString(),
        name: tagInput.trim()
      };
      settaggedUsers(prev => [...prev, newPerson]);
      setTagInput('');
    }
  };

  const removeTaggedPerson = (id: string): void => {
    settaggedUsers(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className={styles.tagSection}>
      <div className={styles.tagHeader}>
        <UserPlus size={16} />
        <span className={styles.tagLabel}>Tag people</span>
      </div>
      
      <div className={styles.tagInput}>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTaggedPerson()}
          placeholder="Enter username..."
          className={styles.tagInputField}
        />
        <button
          onClick={addTaggedPerson}
          className={styles.tagAddButton}
        >
          Add
        </button>
      </div>
      
      {taggedUsers.length > 0 && (
        <div className={styles.tagList}>
          {taggedUsers.map((person) => (
            <span
              key={person.id}
              className={styles.tag}
            >
              @{person.name}
              <button
                onClick={() => removeTaggedPerson(person.id)}
                className={styles.tagRemove}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;