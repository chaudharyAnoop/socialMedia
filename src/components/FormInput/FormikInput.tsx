import React, { useState } from "react";
import { useField } from "formik";
import { Eye, EyeOff } from "lucide-react";
import styles from "./FormInput.module.css";

interface FormikInputProps {
  name: string;
  type?: string;
  placeholder?: string;
  label?: string;
  showPasswordToggle?: boolean;
  maxLength?: number;
  onFocus?: () => void;
  onBlur?: () => void;
}

const FormikInput: React.FC<FormikInputProps> = ({
  name,
  type = "text",
  placeholder,
  label,
  showPasswordToggle = false,
  maxLength,
  onFocus,
  onBlur,
  ...props
}) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;
  const hasError = meta.touched && meta.error;

  return (
    <div className={styles.inputContainer}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        <input
          {...field}
          {...props}
          type={inputType}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`${styles.input} ${hasError ? styles.error : ""}`}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {hasError && <div className={styles.errorMessage}>{meta.error}</div>}
    </div>
  );
};

export default FormikInput;
