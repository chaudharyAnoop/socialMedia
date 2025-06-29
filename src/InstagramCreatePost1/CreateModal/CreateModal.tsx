import React, { useRef, ChangeEvent, useState } from 'react';
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
  setSelectedMedia: React.Dispatch<React.SetStateAction<SelectedMedia[]>>;
  onClose: () => void;
  onNext: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({
  closeCreateModal,
  selectedMedia,
  setSelectedMedia,
  onClose,
  onNext
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target?.files || []);
    if (files.length === 0) return;
    handleFiles(files);
  };

  const handleFiles = async (files: File[]): Promise<void> => {
    setLoading(true);

    const mediaFiles = files.filter(file =>
      file?.type?.startsWith('image/') || file?.type?.startsWith('video/')
    );

    if (mediaFiles.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const newMedia: SelectedMedia[] = [];

      for (const file of mediaFiles) {
        const { data } = await axios.post(Send_MEDIA2S3, {
          files: [`${file?.name}`]
        }, {
          timeout: 10000
        });

        const presigned = data?.urls?.[0];
        if (!presigned?.uploadUrl || !presigned?.publicUrl || !presigned?.fileKey) {
          console.error('Invalid presigned URL data:', presigned);
          continue;
        }

        newMedia.push({
          file,
          preview: URL.createObjectURL(file),
          type: file?.type?.startsWith('image/') ? 'image' : 'video',
          presignedData: presigned
        });
      }

      if (newMedia.length > 0) {
        setSelectedMedia(prev => [...prev, ...newMedia]);
      }
    } catch (error: any) {
      if (error?.code === "ECONNABORTED") {
        closeCreateModal();
      } else {
        
        closeCreateModal();
      }
    } finally {
      setLoading(false);
    }
  };

  const openFileSelector = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className={styles?.modal}>
        <div className={styles?.modalContent}>
          
          <div className={styles?.modalHeader}>
            <button onClick={onClose} className={styles?.modalHeaderButton}>
              <X size={24} color="#6b7280" />
            </button>
            <h3 className={styles?.modalTitle}>Create new post</h3>
            {selectedMedia?.length > 0 && (
              <button
                onClick={onNext}
                disabled={loading}
                className={styles?.modalHeaderButtonRight}
              >
                {loading ? 'Loading...' : 'Next'}
              </button>
            )}
          </div>

          <div className={styles?.modalBody}>
            {selectedMedia?.length === 0 ? (
              <DropZone
                onFilesSelected={handleFiles}
                openFileSelector={openFileSelector}
              />
            ) : (
              <MediaCarousel
                selectedMedia={selectedMedia}
                setSelectedMedia={setSelectedMedia}
                onAddMore={openFileSelector}
              />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className={styles?.hiddenInput}
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className={styles?.loaderOverlay}>
          <div className={styles?.loaderContainer}>
            <div className={styles?.circularLoader}></div>
            <p className={styles?.loaderText}>Processing files...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateModal;
