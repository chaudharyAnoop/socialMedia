import React, { useRef, ChangeEvent, useState } from 'react';
import { X } from 'lucide-react';
import styles from './CreateModal.module.css';
import DropZone from '../DropZone/DropZone';
import MediaCarousel from '../MediaCarousel/MediaCarousel';
import axios from 'axios';

interface SelectedMedia {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface CreateModalProps {
  setUploadedKeys:React.Dispatch<React.SetStateAction<string[]>>;
  setTimestamp:React.Dispatch<React.SetStateAction<string>>;
  selectedMedia: SelectedMedia[];
  setSelectedMedia: React.Dispatch<React.SetStateAction<SelectedMedia[]>>;
  onClose: () => void;
  onNext: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({
  setUploadedKeys,
  setTimestamp,
  selectedMedia,
  setSelectedMedia,
  onClose,
  onNext
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false); // 👈 loader state

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };


//-----------------------------------------------------------------------------
//this is the  code which is used to pass the data
//actual api calling 
// const handleFiles = async (files: File[]): Promise<void> => {
//   setLoading(true);

//   const mediaFiles = files.filter(file =>
//     file.type.startsWith('image/') || file.type.startsWith('video/')
//   );

//   const newMedia: SelectedMedia[] = mediaFiles.map(file => ({
//     file,
//     preview: URL.createObjectURL(file),
//     type: file.type.startsWith('image/') ? 'image' : 'video',
//   }));

//   try {
//     const uploadedUrls: string[] = [];

//     for (const file of mediaFiles) {
//       // 1️⃣ Request presigned URL from your backend
//       const { data } = await axios.post('https://jsonplaceholder.typicode.com/posts', {
//         fileName: file.name,
//         fileType: file.type,
//       });

//       // 2️⃣ Upload the file directly to S3 using the pre-signed PUT URL
//       //here we put data.urls.uploadUrL
//       await axios.put('https://jsonplaceholder.typicode.com/posts/1', file, {
//         headers: {
//           'Content-Type': file.type,
//         },
        
//       });

//       // 3️⃣ Collect the public S3 URL
//       uploadedUrls.push(data.publicUrl);
//     }

//     setUploadedKeys(prev => [...prev, ...uploadedUrls]);
//     setTimestamp(new Date().toISOString());
//   } catch (error) {
//     console.error('S3 Upload failed:', error);
//   } finally {
//     setLoading(false);
//   }

//   setSelectedMedia(prev => [...prev, ...newMedia]);
// };


//Duummy api calling
const handleFiles = async (files: File[]): Promise<void> => {
  setLoading(true);

  const mediaFiles = files.filter(file =>
    file.type.startsWith('image/') || file.type.startsWith('video/')
  );

  const newMedia: SelectedMedia[] = mediaFiles.map(file => ({
    file,
    preview: URL.createObjectURL(file),
    type: file.type.startsWith('image/') ? 'image' : 'video',
  }));

  try {
    const uploadedUrls: string[] = [];

    for (const file of mediaFiles) {
      // 🧪 Dummy simulated presign URL response
      const data = {
        uploadUrl: 'https://dummyjson.com/posts/1', // dummy PUT endpoint
        publicUrl: `https://dummy-cdn.com/media/${file.name}`, // dummy public file URL
      };

      // Simulate upload
      await axios.put(data.uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
     console.log('success');
      // Save dummy URL
      uploadedUrls.push(data.publicUrl);
    }

    setUploadedKeys(prev => [...prev, ...uploadedUrls]);
    setTimestamp(new Date().toISOString());
  } catch (error) {
    console.error('S3 Upload failed:', error);
  } finally {
    setLoading(false);
  }

  setSelectedMedia(prev => [...prev, ...newMedia]);
};


  const openFileSelector = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <button
            onClick={onClose}
            className={styles.modalHeaderButton}
          >
            <X size={24} color="#6b7280" />
          </button>
          <h3 className={styles.modalTitle}>Create new post</h3>
          {selectedMedia.length > 0 && (
            <button
              onClick={onNext}
              disabled={loading} // 👈 disable while loading
              className={styles.modalHeaderButtonRight}
            >
              {loading ? 'Loading...' : 'Next'} {/* 👈 loader text */}
            </button>
          )}
        </div>

        {/* Modal Content */}
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
              onAddMore={openFileSelector}
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
  );
};

export default CreateModal;
