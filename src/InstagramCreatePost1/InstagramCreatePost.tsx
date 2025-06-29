import React, { useState } from 'react';
import styles from './InstagramCreatePost.module.css';
import CreateModal from './CreateModal/CreateModal';
import ShareModal from './ShareModal/ShareModal';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { AxiosResponse  , AxiosError} from 'axios';
import { uploadmedia } from './baseURL';
import { useNavigate } from 'react-router-dom';

interface SelectedMedia {
  file: File;
  preview: string;
  type: 'image' | 'video';
  presignedData?: {
    uploadUrl: string;
    publicUrl: string;
    fileKey: string;
  };
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
  const [visibility,setVisibility] = useState<any>("public");


  const Navigate = useNavigate();


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
   
  };

  const handleShare = async (): Promise<void> => {
   


const token = localStorage.getItem("instagram_user");
     
     const media: string[] = [];
     for (const singlemedia of selectedMedia) {
      if (!singlemedia?.presignedData) continue;
      
      await axios.put(singlemedia?.presignedData?.uploadUrl, singlemedia?.file, {
        headers: {
          'Content-Type': singlemedia?.file?.type,
        },
      });
      
      media.push(singlemedia?.presignedData?.fileKey);
    }

   
  
      const payload: {
        media: string[];
        content: string;
        taggedUsers?: string[];
        visibility: string;
      } = {
        media,
        content,
        visibility
      };
if (taggedUsers?.length > 0) {
  payload.taggedUsers = taggedUsers?.map(p => p?.id);
}
    axios.post(
      uploadmedia,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
       
      }
    )
    .then((response : AxiosResponse) => {
      console.log('Posted successfully', response?.data);
    })
    .catch((error:AxiosError) => {
      console.error('Error posting data', error);
    });  
    closeShareModal();
    Navigate("/")
  };
  

  return (
    <div className={styles.container}>
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

      {isCreateModalOpen && (
        <CreateModal
          closeCreateModal={closeCreateModal}
          selectedMedia={selectedMedia}
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