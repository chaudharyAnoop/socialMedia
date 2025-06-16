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
  const [caption, setCaption] = useState('');
  const [taggedPeople, setTaggedPeople] = useState<TaggedPerson[]>([]);
  const [timestamp, setTimestamp] = useState<string>('');
  const [uploadedKeys, setUploadedKeys] = useState<string[]>([]);



  const closeCreateModal = (): void => {
    setIsCreateModalOpen(false);
    setSelectedMedia([]);
    setCaption('');
    setTaggedPeople([]);
  };

  const openShareModal = (): void => {
    setIsCreateModalOpen(false);
    setIsShareModalOpen(true);
  };

  const closeShareModal = (): void => {
    setIsShareModalOpen(false);
    setSelectedMedia([]);
    setCaption('');
    setTaggedPeople([]);
  };
//here we send the request to gaurav with link,caption,tags people  
  const handleShare = (): void => {
    console.log('Sharing post:', {
      media: selectedMedia.map(m => ({ name: m.file.name, type: m.type })),
      caption,
      taggedPeople: taggedPeople.map(p => p.name),
      uploadedKeys
    });
    const payload = {
      timestamp,
      caption,
      taggedPeople: taggedPeople.map(p => p.name),
      // media: selectedMedia.map(m => ({
      //   name: m.file.name,
      //   type: m.type
      // }))
    };
    axios.post(
      uploadmedia,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer your_token' // if needed
        },
        withCredentials: true 
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
          setUploadedKeys={setUploadedKeys}
          setSelectedMedia={setSelectedMedia}
          onClose={closeCreateModal}
          onNext={openShareModal}
        />
      )}

      {isShareModalOpen && selectedMedia.length > 0 && (
        <ShareModal
          selectedMedia={selectedMedia}
          caption={caption}
          setCaption={setCaption}
          taggedPeople={taggedPeople}
          setTaggedPeople={setTaggedPeople}
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