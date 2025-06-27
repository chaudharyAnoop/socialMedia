import React, { useReducer } from 'react';
import styles from './InstagramCreatePost.module.css';
import CreateModal from './CreateModal/CreateModal';
import ShareModal from './ShareModal/ShareModal';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { AxiosResponse, AxiosError } from 'axios';
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

interface State {
  isCreateModalOpen: boolean;
  isShareModalOpen: boolean;
  selectedMedia: SelectedMedia[];
  content: string;
  taggedUsers: TaggedPerson[];
  visibility: string;
}

type Action =
  | { type: 'OPEN_CREATE_MODAL' }
  | { type: 'CLOSE_CREATE_MODAL' }
  | { type: 'OPEN_SHARE_MODAL' }
  | { type: 'CLOSE_SHARE_MODAL' }
  | { type: 'SET_SELECTED_MEDIA'; payload: SelectedMedia[] }
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_TAGGED_USERS'; payload: TaggedPerson[] }
  | { type: 'SET_VISIBILITY'; payload: string }
  | { type: 'RESET_POST_DATA' };

const initialState: State = {
  isCreateModalOpen: false,
  isShareModalOpen: false,
  selectedMedia: [],
  content: "",
  taggedUsers: [],
  visibility: 'public'
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'OPEN_CREATE_MODAL':
      return { ...state, isCreateModalOpen: true };
    case 'CLOSE_CREATE_MODAL':
      return { ...state, isCreateModalOpen: false };
    case 'OPEN_SHARE_MODAL':
      return { ...state, isCreateModalOpen: false, isShareModalOpen: true };
    case 'CLOSE_SHARE_MODAL':
      return { ...state, isShareModalOpen: false };
    case 'SET_SELECTED_MEDIA':
      return { ...state, selectedMedia: action.payload };
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    case 'SET_TAGGED_USERS':
      return { ...state, taggedUsers: action.payload };
    case 'SET_VISIBILITY':
      return { ...state, visibility: action.payload };
    case 'RESET_POST_DATA':
      return { ...state, selectedMedia: [], content: '', taggedUsers: [], visibility: 'public' };
    default:
      return state;
  }
};

const InstagramCreatePost: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const closeCreateModal = () => {
    dispatch({ type: 'CLOSE_CREATE_MODAL' });
    dispatch({ type: 'RESET_POST_DATA' });
  };

  const openShareModal = () => dispatch({ type: 'OPEN_SHARE_MODAL' });

  const closeShareModal = () => {
    dispatch({ type: 'CLOSE_SHARE_MODAL' });
    dispatch({ type: 'RESET_POST_DATA' });
  };

  const handleShare = async () => {
    const token = localStorage.getItem("instagram_user");
    const media: string[] = [];
    
    for (const singlemedia of state.selectedMedia) {
      if (!singlemedia?.presignedData) continue;
      
      await axios.put(singlemedia.presignedData.uploadUrl, singlemedia.file, {
        headers: { 'Content-Type': singlemedia.file.type }
      });
      
      media.push(singlemedia.presignedData.fileKey);
    }

    const payload: any = { media, content: state.content, visibility: state.visibility };
    if (state.taggedUsers.length > 0) {
      payload.taggedUsers = state.taggedUsers.map(p => p.id);
    }

    axios.post(uploadmedia, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response: AxiosResponse) => console.log('Posted successfully', response.data))
    .catch((error: AxiosError) => console.error('Error posting data', error));
    
    closeShareModal();
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Instagram</h1>
          <button onClick={() => dispatch({ type: 'OPEN_CREATE_MODAL' })} className={styles.createButton}>
            <Plus size={18} />
            <span className={styles.createButtonText}>Create Post</span>
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.welcome}>
          <h2 className={styles.welcomeTitle}>Share your moments</h2>
          <p className={styles.welcomeText}>Click "Create Post" to get started</p>
        </div>
      </main>

      {/* {state.isCreateModalOpen && (
        <CreateModal
          closeCreateModal={closeCreateModal}
          selectedMedia={state.selectedMedia}
          setSelectedMedia={(media) => dispatch({ type: 'SET_SELECTED_MEDIA', payload: media })}
          onClose={closeCreateModal}
          onNext={openShareModal}
        />
      )} */}
      {state.isCreateModalOpen && (
  <CreateModal
    closeCreateModal={closeCreateModal}
    selectedMedia={state.selectedMedia}
    setSelectedMedia={(media) => {
      const updatedMedia =
        typeof media === 'function' ? media(state.selectedMedia) : media;
      dispatch({ type: 'SET_SELECTED_MEDIA', payload: updatedMedia });
    }}
    onClose={closeCreateModal}
    onNext={openShareModal}
  />
)}


      {state.isShareModalOpen && state.selectedMedia.length > 0 && (
        <ShareModal
          selectedMedia={state.selectedMedia}
          content={state.content}
          visibility={state.visibility}
          setVisibility={(visibility) => dispatch({ type: 'SET_VISIBILITY', payload: visibility })}
          setcontent={(content) => dispatch({ type: 'SET_CONTENT', payload: content })}
          taggedUsers={state.taggedUsers}
          settaggedUsers={(users) => dispatch({ type: 'SET_TAGGED_USERS', payload: users })}
          onBack={() => {
            dispatch({ type: 'CLOSE_SHARE_MODAL' });
            dispatch({ type: 'OPEN_CREATE_MODAL' });
          }}
          onShare={handleShare}
        />
      )}
    </div>
  );
};

export default InstagramCreatePost;