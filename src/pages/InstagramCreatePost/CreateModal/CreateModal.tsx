import React, { useRef, ChangeEvent, useState } from "react";
import { X } from "lucide-react";
import styles from "./CreateModal.module.css";
import DropZone from "../DropZone/DropZone";
import MediaCarousel from "../MediaCarousel/MediaCarousel";
import axios from "axios";
import { Presign_Generation } from "../baseURL";

interface SelectedMedia {
  file: File;
  preview: string;
  type: "image" | "video";
}

interface CreateModalProps {
  setmediaKeys: React.Dispatch<React.SetStateAction<string[]>>;
  setTimestamp: React.Dispatch<React.SetStateAction<string>>;
  selectedMedia: SelectedMedia[];
  setSelectedMedia: React.Dispatch<React.SetStateAction<SelectedMedia[]>>;
  onClose: () => void;
  onNext: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({
  setmediaKeys,
  setTimestamp,
  selectedMedia,
  setSelectedMedia,
  onClose,
  onNext,
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
  const handleFiles = async (files: File[]): Promise<void> => {
    setLoading(true);

    const mediaFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    const newMedia: SelectedMedia[] = mediaFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
    }));

    try {
      const mediaKeys: string[] = [];

      for (const file of mediaFiles) {
        // 1️⃣ Request presigned URL from your backend
        const { data } = await axios.post(
          "http://172.50.5.88:3000/media/uploadMedia",
          {
            files: [`${file.name}`],
          }
        );

        console.log(data.urls[0]);
        const uploadurl = data.urls[0].uploadUrl;
        console.log(uploadurl);

        // 2️⃣ Upload the file directly to S3 using the pre-signed PUT URL
        // here we put data.urls.uploadUrL
        await axios.put(uploadurl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        // 3️⃣ Collect the public S3 URL
        mediaKeys.push(data.urls[0].fileKey);
      }

      setmediaKeys((prev) => [...prev, ...mediaKeys]);
      setTimestamp(new Date().toISOString());
    } catch (error) {
      console.error("S3 Upload failed:", error);
    } finally {
      setLoading(false);
    }

    setSelectedMedia((prev) => [...prev, ...newMedia]);
  };

  const openFileSelector = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <button onClick={onClose} className={styles.modalHeaderButton}>
            <X size={24} color="#6b7280" />
          </button>
          <h3 className={styles.modalTitle}>Create new post</h3>
          {selectedMedia.length > 0 && (
            <button
              onClick={onNext}
              disabled={loading} // 👈 disable while loading
              className={styles.modalHeaderButtonRight}
            >
              {loading ? "Loading..." : "Next"} {/* 👈 loader text */}
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
