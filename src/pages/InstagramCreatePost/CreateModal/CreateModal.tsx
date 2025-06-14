import React, { useRef, ChangeEvent, useState } from 'react';
import { X } from 'lucide-react';
import styles from './CreateModal.module.css';
import DropZone from '../DropZone/DropZone';
import MediaCarousel from '../MediaCarousel/MediaCarousel';

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

  // const handleFiles = async (files: File[]): Promise<void> => {
  //   setLoading(true); // 👈 start loader

  //   try {
  //     const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         message: 'User selected media files',
  //         fileCount: files.length,
  //         timestamp: new Date().toISOString()
  //       }),
  //     });

  //     const data = await response.json();
  //     console.log('Dummy API called successfully:', data);
  //   } catch (error) {
  //     console.error('Dummy API call failed:', error);
  //   } finally {
  //     setLoading(false); // 👈 stop loader
  //   }

  //   const mediaFiles = files.filter(file =>
  //     file.type.startsWith('image/') || file.type.startsWith('video/')
  //   );

  //   const newMedia: SelectedMedia[] = mediaFiles.map(file => ({
  //     file,
  //     preview: URL.createObjectURL(file),
  //     type: file.type.startsWith('image/') ? 'image' : 'video'
  //   }));

  //   setSelectedMedia(prev => [...prev, ...newMedia]);

  //   console.log('hi');
  //   console.log(newMedia);
  // };

// ------------------


const handleFiles = async (files: File[]): Promise<void> => {
  setLoading(true);

  const mediaFiles = files.filter(file =>
    file.type.startsWith('image/') || file.type.startsWith('video/')
  );
  console.log(mediaFiles);
  const newMedia: SelectedMedia[] = mediaFiles.map(file => ({
    file,
    preview: URL.createObjectURL(file),
    type: file.type.startsWith('image/') ? 'image' : 'video'
  }));

  const payload = {
    mediaFiles: mediaFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    }))
  };
//here we are getting the links of media images 
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Updated media files',
        mediaCount: newMedia.length,
        files: payload,
        timestamp: new Date().toISOString()
      }),

    });

    const data = await response.json();
    setUploadedKeys((prev)=>[...prev , "link1" , "link2"]);
    setTimestamp(data.timestamp);
    console.log('Dummy PUT API called successfully:', data);
  } catch (error) {
    console.error('Dummy PUT API call failed:', error);
  } finally {
    setLoading(false);
  }
  
  setSelectedMedia(prev => [...prev, ...newMedia]);

  console.log('hi');
  console.log(newMedia);
};
//-----------------------------------------------------------------------------
//this is the  code which is used to pass the data
// try {
//   const uploadedKeys: string[] = [];

//   for (const file of mediaFiles) {
//     const uploadUrl = `https://your-s3-upload-url.com/${encodeURIComponent(file.name)}`;

//     const res = await axios.put(uploadUrl, file, {
//       headers: {
//         'Content-Type': file.type,
//       },
//     });

//     // Get key from response or fallback to file name
//     const key = res.data?.key || file.name;
//     uploadedKeys.push(key);
//   }

//   // ✅ Push all uploaded keys to parent state
//   setUploadedKeys(prevKeys => [...prevKeys, ...uploadedKeys]);

//   setTimestamp(new Date().toISOString());
// } catch (error) {
//   console.error('Upload failed:', error);
// } finally {
//   setLoading(false);
// }





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
