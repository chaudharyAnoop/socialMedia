import React, { useReducer } from "react";

import { X, ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./MediaCarousel.module.css";

import { MediaTypeEnum } from "../../../enums/MediaTypeEnum";

interface SelectedMedia {
  file: File;
  preview: string;
  type: MediaTypeEnum;
}

interface MediaCarouselProps {
  selectedMedia: SelectedMedia[];
  setSelectedMedia: (media: SelectedMedia[]) => void;
  shareMode?: boolean;
}

interface State {
  currentMediaIndex: number;
}

type Action = { type: "SET_CURRENT_INDEX"; payload: number };

const initialState: State = { currentMediaIndex: 0 };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_CURRENT_INDEX":
      return { ...state, currentMediaIndex: action.payload };
    default:
      return state;
  }
};

const MediaCarousel: React.FC<MediaCarouselProps> = ({
  selectedMedia,
  setSelectedMedia,
  shareMode = false,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(selectedMedia[index].preview);
    const newMedia = selectedMedia.filter((_, i) => i !== index);
    setSelectedMedia(newMedia);
    if (state.currentMediaIndex >= newMedia.length) {
      dispatch({
        type: "SET_CURRENT_INDEX",
        payload: Math.max(0, newMedia.length - 1),
      });
    }
  };

  const nextMedia = () => {
    dispatch({
      type: "SET_CURRENT_INDEX",
      payload: Math.min(state.currentMediaIndex + 1, selectedMedia.length - 1),
    });
  };

  const prevMedia = () => {
    dispatch({
      type: "SET_CURRENT_INDEX",
      payload: Math.max(state.currentMediaIndex - 1, 0),
    });
  };

  return (
    <div className={styles.mediaContainer}>
      <div className={styles.mediaCarousel}>
        <div className={styles.mediaFrame}>
          {selectedMedia[state.currentMediaIndex]?.type === "image" ? (
            <img
              src={selectedMedia[state.currentMediaIndex]?.preview}
              alt="Selected"
              className={styles.mediaItem}
            />
          ) : (
            <video
              src={selectedMedia[state.currentMediaIndex]?.preview}
              className={styles.mediaItem}
              controls
            />
          )}
        </div>
        {selectedMedia.length > 1 && (
          <>
            {state.currentMediaIndex > 0 && (
              <button onClick={prevMedia} className={styles.navButtonLeft}>
                <ChevronLeft size={20} />
              </button>
            )}
            {state.currentMediaIndex < selectedMedia.length - 1 && (
              <button onClick={nextMedia} className={styles.navButtonRight}>
                <ChevronRight size={20} />
              </button>
            )}
          </>
        )}
        {selectedMedia.length > 1 && !shareMode && (
          <div className={styles.mediaCounter}>
            {state.currentMediaIndex + 1}/{selectedMedia.length}
          </div>
        )}
        {!shareMode && (
          <button
            onClick={() => removeMedia(state.currentMediaIndex)}
            className={styles.removeButton}
          >
            <X size={10} />
          </button>
        )}
      </div>
      {selectedMedia.length > 1 && !shareMode && (
        <div className={styles.thumbnailStrip}>
          {selectedMedia.map((media, index) => (
            <button
              key={index}
              onClick={() =>
                dispatch({ type: "SET_CURRENT_INDEX", payload: index })
              }
              className={`${styles.thumbnail} ${
                index === state.currentMediaIndex ? styles.thumbnailActive : ""
              }`}
            >
              {media.type === MediaTypeEnum.Image ? (
                <img
                  src={media.preview}
                  alt={`Thumbnail ${index + 1}`}
                  className={styles.thumbnailImage}
                />
              ) : (
                <video src={media.preview} className={styles.thumbnailImage} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;
