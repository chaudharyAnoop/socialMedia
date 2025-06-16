import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useAuth } from '../../contexts/AuthContext';
import { signupValidationSchema } from '../../utils/validationSchemas';
import FormikInput from '../FormInput/FormikInput';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import SocialLogin from '../SocialLogin/SocialLogin';
import styles from './AuthForm.module.css';

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onShowOTP: (email: string) => void;
}

interface SignupFormValues {
  email: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  bio: string;
  profilePicture: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin, onShowOTP }) => {
  const { register } = useAuth();
  const [serverError, setServerError] = useState('');

  const initialValues: SignupFormValues = {
    email: '',
    username: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    bio: '',
    profilePicture: '',
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file and get a URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue('profilePicture', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (
    values: SignupFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setServerError('');
    
    try {
      const result = await register({
        email: values.email,
        username: values.username,
        fullName: values.fullName,
        password: values.password,
        bio: values.bio,
        profilePicture: values.profilePicture,
      });
      
      if (result.success) {
        if (result.requiresOTP) {
          onShowOTP(values.email);
        }
      } else {
        setServerError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authWrapper}>
        <div className={styles.authBox}>
          <div className={styles.logo}>
            <h1 className={styles.logoText}>Instagram</h1>
          </div>
          
          <p className={styles.subtitle}>
            Sign up to see photos and videos from your friends.
          </p>

          <SocialLogin />

          <Formik
            initialValues={initialValues}
            validationSchema={signupValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, dirty, values, setFieldValue }) => (
              <Form className={styles.form}>
                {serverError && (
                  <div className={styles.errorMessage}>{serverError}</div>
                )}

                <FormikInput
                  type="email"
                  name="email"
                  placeholder="Mobile number or email address"
                  autoComplete="email"
                />

                <FormikInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  showPasswordToggle={true}
                />

                <PasswordStrength password={values.password} />

                <FormikInput
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  showPasswordToggle={true}
                />

                <FormikInput
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  autoComplete="name"
                />

                <FormikInput
                  type="text"
                  name="username"
                  placeholder="Username"
                  autoComplete="username"
                />

                <FormikInput
                  type="text"
                  name="bio"
                  placeholder="Bio (optional)"
                />

                <Field name="profilePicture">
                  {({ field }: any) => (
                    <>
                      <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setFieldValue)}
                        className={styles.fileInput}
                      />
                      <label 
                        htmlFor="profilePicture" 
                        className={`${styles.fileInputLabel} ${field.value ? styles.hasFile : ''}`}
                      >
                        {field.value ? 'Profile picture selected' : 'Choose profile picture (optional)'}
                      </label>
                    </>
                  )}
                </Field>

                <div className={styles.terms}>
                  People who use our service may have uploaded your contact information to Instagram.{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Learn more</a>
                  <br /><br />
                  By signing up, you agree to our{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>,{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a> and{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Cookies Policy</a>.
                </div>

                <button
                  type="submit"
                  className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
                  disabled={!isValid || !dirty || isSubmitting}
                >
                  {isSubmitting && <div className={styles.spinner}></div>}
                  Sign Up
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <div className={styles.switchBox}>
          Have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
            Log in
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;