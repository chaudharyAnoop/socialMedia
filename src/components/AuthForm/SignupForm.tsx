import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import { useAuth } from '../../contexts/AuthContext';
import { FormikInput } from '../FormInput/FormikInput';
import { SocialLogin } from '../SocialLogin/SocialLogin';
import { signupSchema } from '../../utils/validationSchemas';
import styles from './AuthForm.module.css';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

interface SignupFormValues {
  email: string;
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  bio: string;
  profilePicture: File | null;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const { signup, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const initialValues: SignupFormValues = {
    email: '',
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    bio: '',
    profilePicture: null
  };

  const handleSubmit = async (values: SignupFormValues) => {
    try {
      await signup({
        email: values.email,
        fullName: values.fullName,
        username: values.username,
        password: values.password,
        bio: values.bio || undefined,
        profilePicture: values.profilePicture || undefined
      });
    } catch (err) {
      // Error is handled by the context
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>Instagram</h1>
        </div>

        <div className={styles.card}>
          <Formik
            initialValues={initialValues}
            validationSchema={signupSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid, dirty }) => (
              <Form className={styles.form}>
                <h2 className={styles.title}>
                  Sign up to see photos and videos from your friends.
                </h2>

                <SocialLogin mode="signup" />

                <div className={styles.divider}>OR</div>

                {error && (
                  <div className={styles.errorAlert}>
                    {error}
                  </div>
                )}

                <FormikInput
                  name="email"
                  type="email"
                  placeholder="Email"
                />

                <FormikInput
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                />

                <FormikInput
                  name="username"
                  type="text"
                  placeholder="Username"
                />

                <FormikInput
                  name="password"
                  type="password"
                  placeholder="Password"
                  showPasswordStrength={true}
                />

                <FormikInput
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                />

                <FormikInput
                  name="bio"
                  type="textarea"
                  placeholder="Bio (Optional)"
                />

                <FormikInput
                  name="profilePicture"
                  type="file"
                  placeholder="Choose Profile Picture"
                  accept="image/*"
                />

                <p className={styles.subtitle}>
                  By signing up, you agree to our Terms, Data Policy and Cookies Policy.
                </p>

                <button
                  type="submit"
                  className={styles.button}
                  disabled={isLoading || !isValid || !dirty}
                >
                  {isLoading ? (
                    <>
                      <div className={styles.spinner} />
                      Creating account...
                    </>
                  ) : (
                    'Sign up'
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <div className={styles.switchCard}>
          <span className={styles.switchText}>
            Have an account?
            <button
              type="button"
              className={styles.switchLink}
              onClick={onSwitchToLogin}
            >
              Log in
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};