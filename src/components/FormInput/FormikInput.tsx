import React, { useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import styles from './FormInput.module.css';

interface FormikInputProps {
  name: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
  showPasswordToggle?: boolean;
}

const FormikInput: React.FC<FormikInputProps> = ({
  name,
  type,
  placeholder,
  autoComplete,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <Field name={name}>
          {({ field, meta }: any) => (
            <>
              <input
                {...field}
                type={inputType}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={`${styles.inputField} ${
                  meta.error && meta.touched ? styles.hasError : ''
                } ${field.value ? styles.filled : ''} ${isFocused ? styles.focused : ''}`}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {showPasswordToggle && (
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </>
          )}
        </Field>
      </div>
      <ErrorMessage name={name} component="div" className={styles.errorMessage} />
    </div>
  );
};

export default FormikInput;