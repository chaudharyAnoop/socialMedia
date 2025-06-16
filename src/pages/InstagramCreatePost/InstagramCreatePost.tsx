import React, { useState } from 'react';
import styles from './InstagramCreatePost.module.css';
import CreateModal from './CreateModal/CreateModal';
import ShareModal from './ShareModal/ShareModal';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { AxiosResponse  , AxiosError} from 'axios';
import { uploadmedia } from './baseURL';

interface SelectedMedia {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface TaggedPerson {
  id: string;
  name: string;
}

const InstagramCreatePost: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia[]>([]);
  const [content, setcontent] = useState('');
  const [taggedUsers, settaggedUsers] = useState<TaggedPerson[]>([]);
  const [visibility,setVisibility] = useState<any>("");
  const [timestamp, setTimestamp] = useState<string>('');
  const [mediaKeys, setmediaKeys] = useState<string[]>([]);



  const closeCreateModal = (): void => {
    setIsCreateModalOpen(false);
    setSelectedMedia([]);
    setcontent('');
    settaggedUsers([]);
  };

  const openShareModal = (): void => {
    setIsCreateModalOpen(false);
    setIsShareModalOpen(true);
  };

  const closeShareModal = (): void => {
    setIsShareModalOpen(false);
    setSelectedMedia([]);
    setcontent('');
    setVisibility("");
    settaggedUsers([]);
    setmediaKeys([]);
  };
  const token  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ4MDNjNTA1NzRjNGVlNDFlZDIxYTgiLCJlbWFpbCI6ImFrc2hhdEBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImRldmljZUlkIjoidGVzdC1kZXZpY2UiLCJpcEFkZHJlc3MiOiIxMjcuMC4wLjEiLCJ1c2VyQWdlbnQiOiJQb3N0bWFuUnVudGltZS83LjI5LjAiLCJpYXQiOjE3NTAwNzQ3MTcsImV4cCI6MTc1MDE2MTExNywic3ViIjoiNjg0ODAzYzUwNTc0YzRlZTQxZWQyMWE4In0.chBN1DBNLUADQ2LLYQKwinmCUioW2EowVK6JKu6kh00";
//here we send the request to gaurav with link,content,tags people  
  const handleShare = (): void => {
    console.log('Sharing post:', {
      content,
      taggedUsers: taggedUsers.map(p => p.name),
      mediaKeys,
      visibility
    });
    const payload = {
      mediaKeys,
      content,
      // taggedUsers: taggedUsers.map(p => p.name),
      visibility
    };
    axios.post(
      uploadmedia,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // if needed token is above in this file dont find here and there
        },
       
      }
    )
    .then((response : AxiosResponse) => {
      console.log('Posted successfully', response.data);
    })
    .catch((error:AxiosError) => {
      console.error('Error posting data', error);
    });
  
    // console.log("Final POST Payload:", payload);

    closeShareModal();
  };

  return (
    <div className={styles.container}>
      {/* Main Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            Instagram
          </h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={styles.createButton}
          >
            <Plus size={18} />
            <span className={styles.createButtonText}>Create Post</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.welcome}>
          <h2 className={styles.welcomeTitle}>
            Share your moments
          </h2>
          <p className={styles.welcomeText}>
            Click "Create Post" to get started
          </p>
        </div>
      </main>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateModal
          setTimestamp={setTimestamp}
          selectedMedia={selectedMedia}
          setmediaKeys={setmediaKeys}
          setSelectedMedia={setSelectedMedia}
          onClose={closeCreateModal}
          onNext={openShareModal}
        />
      )}

      {isShareModalOpen && selectedMedia.length > 0 && (
        <ShareModal
          selectedMedia={selectedMedia}
          content={content}
          visibility={visibility}
          setVisibility={setVisibility}
          setcontent={setcontent}
          taggedUsers={taggedUsers}
          settaggedUsers={settaggedUsers}
          onBack={() => {
            setIsShareModalOpen(false);
            setIsCreateModalOpen(true);
          }}
          onShare={handleShare}
        />
      )}
    </div>
  );
};

export default InstagramCreatePost;