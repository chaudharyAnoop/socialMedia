import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, X, Search, Loader2 } from 'lucide-react';
import axios from 'axios';
import styles from './TagInput.module.css';
import { SEARCH_USERS } from '../baseURL';

interface TaggedPerson {
  id: string;
  name: string;
}
interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  bio?: string;
}
interface TagInputProps {
  taggedUsers: TaggedPerson[];
  settaggedUsers: React.Dispatch<React.SetStateAction<TaggedPerson[]>>;
}
const TagInput: React.FC<TagInputProps> = ({ taggedUsers, settaggedUsers }) => {
  const [tagInput, setTagInput] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("instagram_user");
  const cleanedUser = token;

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchUsers = async (query: string): Promise<User[]> => {
    try {
      const response = await axios.get(SEARCH_USERS, {
        params: { query },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanedUser}`
        }
      });

      const users = response?.data?.users || response?.data || [];

      return users?.filter((user: User) => {
        const name = user?.fullName || '';
        const username = user?.username || '';
        return (
          name?.toLowerCase()?.includes(query.toLowerCase()) ||
          username?.toLowerCase()?.includes(query.toLowerCase())
        );
      }) || [];
    } catch (error) {
      
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error?.response?.status} - ${error?.response?.statusText || 'Network Error'}`);
      }
      throw new Error('Failed to search users. Please try again.');
    }
  };

  useEffect(() => {
    if (tagInput?.trim()?.length > 0) {
      if (debounceTimeoutRef?.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        setError(null);
        try {
          const results = await searchUsers(tagInput.trim());
          setSearchResults(results);
          setShowDropdown(true);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to search users. Please try again.';
          setError(errorMessage);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    } else {
      setShowDropdown(false);
      setSearchResults([]);
      setIsLoading(false);
    }

    return () => {
      if (debounceTimeoutRef?.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [tagInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef?.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document?.addEventListener('mousedown', handleClickOutside);
    return () => document?.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTaggedPerson = (user?: User): void => {
    const personToAdd = user || {
      _id: Date.now().toString(),
      username: tagInput?.trim(),
      fullName: tagInput?.trim(),
      email: ''
    };

    if (personToAdd?.username && !taggedUsers?.find(p => p?.name === personToAdd?.username)) {
      const newPerson: TaggedPerson = {
        id: personToAdd?._id,
        name: personToAdd?.username
      };
      settaggedUsers(prev => [...prev, newPerson]);
      setTagInput('');
      setShowDropdown(false);
      setSearchResults([]);
    }
  };

  const removeTaggedPerson = (id: string): void => {
    settaggedUsers(prev => prev?.filter(p => p?.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value;
    setTagInput(value);

    if (value?.trim()?.length === 0) {
      setShowDropdown(false);
      setSearchResults([]);
      setIsLoading(false);
      setError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e?.key === 'Enter') {
      e.preventDefault();
      if (!showDropdown && tagInput?.trim()) {
        addTaggedPerson();
      }
    }
  };

  return (
    <div className={styles?.tagSection}>
      <div className={styles?.tagHeader}>
        <UserPlus size={16} />
        <span className={styles?.tagLabel}>Tag people</span>
      </div>

      <div className={styles?.tagInputContainer} ref={dropdownRef}>
        <div className={styles?.tagInput}>
          <div className={styles?.inputWithIcon}>
            <Search size={16} className={styles?.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              value={tagInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Search users..."
              className={styles?.tagInputField}
            />
            {isLoading && (
              <Loader2 size={16} className={`${styles?.loadingIcon} ${styles?.spinning}`} />
            )}
          </div>
          <button
            onClick={() => addTaggedPerson()}
            className={styles?.tagAddButton}
            disabled={!tagInput?.trim() || isLoading}
          >
            Add
          </button>
        </div>

        {showDropdown && (
          <div className={styles?.dropdown}>
            {error ? (
              <div className={styles?.errorMessage}>
                {error}
              </div>
            ) : searchResults?.length > 0 ? (
              <div className={styles?.userList}>
                {searchResults?.map((user) => (
                  <div
                    key={user?._id}
                    className={styles?.userItem}
                    onClick={() => addTaggedPerson(user)}
                  >
                    <div className={styles?.userInfo}>
                      <div className={styles?.userName}>{user?.fullName}</div>
                      <div className={styles?.userHandle}>@{user?.username}</div>
                      {user?.bio && (
                        <div className={styles?.userBio}>{user?.bio}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles?.noResults}>
                No users found for "{tagInput}"
              </div>
            )}
          </div>
        )}
      </div>

      {taggedUsers?.length > 0 && (
        <div className={styles?.tagList}>
          {taggedUsers?.map((person) => (
            <span key={person?.id} className={styles?.tag}>
              @{person?.name}
              <button
                onClick={() => removeTaggedPerson(person?.id)}
                className={styles?.tagRemove}
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
