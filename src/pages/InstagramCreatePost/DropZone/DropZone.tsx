import React, { DragEvent, useReducer } from "react";

import { Upload } from "lucide-react";

import styles from "./DropZone.module.css";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  openFileSelector: () => void;
}

interface State {
  isDragging: boolean;
}

import { ActionTypeEnum } from "../../../enums/ActionTypeEnum";

type Action = { type: ActionTypeEnum.SetDragging; payload: boolean };

const initialState: State = { isDragging: false };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypeEnum.SetDragging:
      return { ...state, isDragging: action.payload };
    default:
      return state;
  }
};

const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  openFileSelector,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch({ type: ActionTypeEnum.SetDragging, payload: true });
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch({ type: ActionTypeEnum.SetDragging, payload: false });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch({ type: ActionTypeEnum.SetDragging, payload: false });
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  return (
    <div
      className={`${styles.dropZone} ${
        state.isDragging ? styles.dropZoneActive : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileSelector}
    >
      <div className={styles.uploadIcon}>
        <Upload size={28} color="white" />
      </div>
      <h4 className={styles.uploadTitle}>Drag photos and videos here</h4>
      <p className={styles.uploadText}>Select from your computer</p>
      <button className={styles.uploadButton}>Select from computer</button>
    </div>
  );
};

export default DropZone;
