import React, { useState } from 'react';
import { Field, ErrorMessage, type FieldProps } from 'formik';
import { Eye, EyeOff, Upload, User } from 'lucide-react';
import { getPasswordStrength } from '../../utils/validationSchemas';
import styles from './FormInput.module.css';

interface FormikInputProps {
  name: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'file';
  placeholder: string;
  showPasswordStrength?: boolean;
  accept?: string;
}

export const FormikInput: React.FC<FormikInputProps> = ({
  name,
  type,
  placeholder,
  showPasswordStrength = false,
  accept
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileDrop = (e: React.DragEvent, setFieldValue: (field: string, value: any) => void) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (type === 'file') {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        setFieldValue(name, files[0]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => {
        const hasError = meta.touched && meta.error;
        const passwordStrength = showPasswordStrength && field.value 
          ? getPasswordStrength(field.value) 
          : null;

        if (type === 'file') {
          return (
            <div className={styles.inputGroup}>
              <input
                type="file"
                id={name}
                accept={accept}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  form.setFieldValue(name, file);
                }}
                onBlur={() => form.setFieldTouched(name, true)}
                className={styles.fileInput}
              />
              <label
                htmlFor={name}
                className={`${styles.fileInputLabel} ${field.value ? styles.hasFile : ''}`}
                onDrop={(e) => handleFileDrop(e, form.setFieldValue)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                  backgroundColor: isDragOver ? '#1A1A1A' : undefined,
                  borderColor: isDragOver ? '#0095F6' : undefined
                }}
              >
                {field.value instanceof File ? (
                  <>
                    <User size={16} />
                    {field.value.name}
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    {placeholder}
                  </>
                )}
              </label>
              <ErrorMessage name={name} component="span" className={styles.errorMessage} />
            </div>
          );
        }

        if (type === 'textarea') {
          return (
            <div className={styles.inputGroup}>
              <textarea
                {...field}
                placeholder={placeholder}
                className={`${styles.input} ${styles.textarea} ${hasError ? styles.error : ''}`}
                onBlur={() => form.setFieldTouched(name, true)}
              />
              <ErrorMessage name={name} component="span" className={styles.errorMessage} />
            </div>
          );
        }

        return (
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input
                {...field}
                type={type === 'password' && showPassword ? 'text' : type}
                placeholder={placeholder}
                className={`${styles.input} ${hasError ? styles.error : ''}`}
                onBlur={() => form.setFieldTouched(name, true)}
              />
              {type === 'password' && (
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>
            {showPasswordStrength && passwordStrength && field.value && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div className={`${styles.strengthProgress} ${styles[passwordStrength]}`} />
                </div>
                <span className={`${styles.strengthText} ${styles[passwordStrength]}`}>
                  Password strength: {passwordStrength}
                </span>
              </div>
            )}
            <ErrorMessage name={name} component="span" className={styles.errorMessage} />
          </div>
        );
      }}
    </Field>
  );
};