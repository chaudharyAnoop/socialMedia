import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Plus } from 'lucide-react';
import styles from './InstagramCreatePost.module.css';
//use only modals not use this whole page 
const CreatePostModal = lazy(() => import('./CreatePostModal/CreatePostModal'));
const ShareModal = lazy(() => import('./ShareModal/ ShareModal'));

interface SelectedImage {
  file: File;
  preview: string;
}

const InstagramCreatePost: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [caption, setCaption] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const preview = URL.createObjectURL(imageFile);
      setSelectedImage({ file: imageFile, preview });
    }
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      setSelectedImage({ file, preview });
    }
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setSelectedImage(null);
    setCaption('');
  }, []);

  const openShareModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setIsShareModalOpen(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setIsShareModalOpen(false);
    setSelectedImage(null);
    setCaption('');
  }, []);

  const handleShare = useCallback(() => {
    console.log('Sharing post:', { image: selectedImage?.file.name, caption });
    closeShareModal();
  }, [selectedImage, caption, closeShareModal]);

  const handleCaptionChange = useCallback((newCaption: string) => {
    setCaption(newCaption);
  }, []);

  return (
    <div className={styles.container}>
      {/* Main Header */}
      {
          // this button is already present inside anoop 
          // we just have to paste the modals compoenents 
          // ad on button setmodalopen(true) if user clicked 
      }
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Instagram</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={styles.createButton}
          >
            <Plus size={20} />
            Create Post
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.heroSection}>
          <h2 className={styles.heroTitle}>Share your moments</h2>
          <p className={styles.heroSubtitle}>Click "Create Post" to get started</p>
        </div>
      </main>

      {/* Modals */}
      <Suspense fallback={<div>Loading...</div>}>
        <CreatePostModal
          isOpen={isCreateModalOpen}
          selectedImage={selectedImage}
          caption={caption}
          isDragging={isDragging}
          onClose={closeCreateModal}
          onNext={openShareModal}
          onFileSelect={handleFileSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onCaptionChange={handleCaptionChange}
        />

        {selectedImage && (
          <ShareModal
            isOpen={isShareModalOpen}
            imageUrl={selectedImage.preview}
            caption={caption}
            onCaptionChange={handleCaptionChange}
            onClose={closeShareModal}
            onShare={handleShare}
            onBack={() => {
              setIsShareModalOpen(false);
              setIsCreateModalOpen(true);
            }}
          />
        )}
      </Suspense>
    </div>
  );
};

export default InstagramCreatePost;