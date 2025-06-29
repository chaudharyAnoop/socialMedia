import React, { useRef, ChangeEvent, useReducer } from 'react';
import { X } from 'lucide-react';
import styles from './CreateModal.module.css';
import DropZone from '../DropZone/DropZone';
import MediaCarousel from '../MediaCarousel/MediaCarousel';
import axios from 'axios';
import { Send_MEDIA2S3 } from '../baseURL';

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

interface CreateModalProps {
  closeCreateModal: () => void;
  selectedMedia: SelectedMedia[];
  setSelectedMedia: (media: SelectedMedia[] | ((prev: SelectedMedia[]) => SelectedMedia[])) => void;
  onClose: () => void;
  onNext: () => void;
}

interface State {
  loading: boolean;
}

type Action = { type: 'SET_LOADING'; payload: boolean };

const initialState: State = { loading: false };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const CreateModal: React.FC<CreateModalProps> = ({
  closeCreateModal,
  selectedMedia,
  setSelectedMedia,
  onClose,
  onNext
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target?.files || []);
    if (files.length === 0) return;
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    const mediaFiles = files.filter(file =>
      file?.type?.startsWith('image/') || file?.type?.startsWith('video/')
    );

    if (mediaFiles.length === 0) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    try {
      const fileNames = mediaFiles.map(file => file.name);

      const { data } = await axios.post(Send_MEDIA2S3, { files: fileNames }, { timeout: 10000 });
      const presignedArray = data?.urls || [];

      const newMedia: SelectedMedia[] = mediaFiles.map((file, index) => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video',
        presignedData: presignedArray[index]
      }));

      setSelectedMedia(prev => [...prev, ...newMedia]);
    } catch (error) {
      closeCreateModal();
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  
  const openFileSelector = () => fileInputRef.current?.click();

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <button onClick={onClose} className={styles.modalHeaderButton}>
              <X size={24} color="#6b7280" />
            </button>
            <h3 className={styles.modalTitle}>Create new post</h3>
            {selectedMedia.length > 0 && (
              <button
                onClick={onNext}
                disabled={state.loading}
                className={styles.modalHeaderButtonRight}
              >
                {state.loading ? 'Loading...' : 'Next'}
              </button>
            )}
          </div>

          <div className={styles.modalBody}>
            {selectedMedia.length === 0 ? (
              <DropZone
                onFilesSelected={handleFiles}
                openFileSelector={openFileSelector}
              />
            ) : (
              <MediaCarousel
                selectedMedia={selectedMedia}
                setSelectedMedia={setSelectedMedia}
              />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className={styles.hiddenInput}
            />
          </div>
        </div>
      </div>

      {state.loading && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loaderContainer}>
            <div className={styles.circularLoader}></div>
            <p className={styles.loaderText}>Processing files...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateModal;

