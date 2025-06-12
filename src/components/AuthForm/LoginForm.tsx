import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import { useAuth } from '../../contexts/AuthContext';
import { FormikInput } from '../FormInput/FormikInput';
import { SocialLogin } from '../SocialLogin/SocialLogin';
import { loginSchema } from '../../utils/validationSchemas';
import styles from './AuthForm.module.css';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { login, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const initialValues: LoginFormValues = {
    email: '',
    password: ''
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
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
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid, dirty }) => (
              <Form className={styles.form}>
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
                  name="password"
                  type="password"
                  placeholder="Password"
                />

                <button
                  type="submit"
                  className={styles.button}
                  disabled={isLoading || !isValid || !dirty}
                >
                  {isLoading ? (
                    <>
                      <div className={styles.spinner} />
                      Logging in...
                    </>
                  ) : (
                    'Log in'
                  )}
                </button>

                <div className={styles.divider}>OR</div>

                <SocialLogin mode="login" />

                <div className={styles.forgotPassword}>
                  <a href="#" className={styles.forgotLink}>
                    Forgot password?
                  </a>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className={styles.switchCard}>
          <span className={styles.switchText}>
            Don't have an account?
            <button
              type="button"
              className={styles.switchLink}
              onClick={onSwitchToSignup}
            >
              Sign up
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};