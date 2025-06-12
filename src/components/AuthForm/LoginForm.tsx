import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { useAuth } from '../../contexts/AuthContext';
import { loginValidationSchema } from '../../utils/validationSchemas';
import FormikInput from '../FormInput/FormikInput';
import SocialLogin from '../SocialLogin/SocialLogin';
import styles from './AuthForm.module.css';

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onShowOTP: (email: string) => void;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup, onShowOTP }) => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setServerError('');
    
    try {
      const result = await login(values.email, values.password);
      
      if (result.success) {
        if (result.requiresOTP) {
          onShowOTP(values.email);
        }
        // If login is successful without OTP, the AuthContext will handle the state change
      } else {
        setServerError(result.message || 'Login failed. Please try again.');
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

          <Formik
            initialValues={initialValues}
            validationSchema={loginValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form className={styles.form}>
                {serverError && (
                  <div className={styles.errorMessage}>{serverError}</div>
                )}

                <FormikInput
                  type="text"
                  name="email"
                  placeholder="Phone number, username or email address"
                  autoComplete="username"
                />

                <FormikInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  showPasswordToggle={true}
                />

                <button
                  type="submit"
                  className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
                  disabled={!isValid || !dirty || isSubmitting}
                >
                  {isSubmitting && <div className={styles.spinner}></div>}
                  Log in
                </button>
              </Form>
            )}
          </Formik>

          <SocialLogin showForgotPassword />
        </div>

        <div className={styles.switchBox}>
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;