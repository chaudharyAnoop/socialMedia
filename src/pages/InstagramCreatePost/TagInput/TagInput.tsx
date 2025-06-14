import React , { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import styles from './TagInput.module.css';

interface TaggedPerson {
  id: string;
  name: string;
}

interface TagInputProps {
  taggedPeople: TaggedPerson[];
  setTaggedPeople: React.Dispatch<React.SetStateAction<TaggedPerson[]>>;
}

const TagInput: React.FC<TagInputProps> = ({ taggedPeople, setTaggedPeople }) => {
  const [tagInput, setTagInput] = useState('');

  const addTaggedPerson = (): void => {
    if (tagInput.trim() && !taggedPeople.find(p => p.name === tagInput.trim())) {
      const newPerson: TaggedPerson = {
        id: Date.now().toString(),
        name: tagInput.trim()
      };
      setTaggedPeople(prev => [...prev, newPerson]);
      setTagInput('');
    }
  };

  const removeTaggedPerson = (id: string): void => {
    setTaggedPeople(prev => prev.filter(p => p.id !== id));
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
      
      {taggedPeople.length > 0 && (
        <div className={styles.tagList}>
          {taggedPeople.map((person) => (
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