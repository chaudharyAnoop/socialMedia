import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";

import FormikInput from "../FormInput/FormikInput";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useAuth } from "../../contexts/AuthContext";
import {
  loginSchema,
  forgotPasswordSchema,
} from "../../utils/validationSchemas";

import styles from "./AuthForm.module.css";

interface LoginFormProps {
  onSignupClick: () => void;
  onForgotPassword: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSignupClick,
  onForgotPassword,
}) => {
  const { login, forgotPassword, loading } = useAuth();
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    setError("");
    try {
      await login(values.email, values.password);
      navigate("/");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const handleForgotPasswordSubmit = async (values: { email: string }) => {
    setError("");
    setForgotPasswordMessage("");
    try {
      await forgotPassword(values.email);
      setForgotPasswordMessage("OTP sent to your email");
      onForgotPassword(values.email);
    } catch (error: any) {
      setError(error.response?.data?.message || "Email not found");
    }
  };

  if (showForgotPassword) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.form}>
          <h1 className={styles.logo}>Instagram</h1>
          <p className={styles.subtitle}>
            Enter your email and we'll send you a link to get back into your
            account.
          </p>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleForgotPasswordSubmit}
          >
            <Form>
              <FormikInput name="email" type="email" placeholder="Email" />

              {error && <div className={styles.error}>{error}</div>}
              {forgotPasswordMessage && (
                <div className={styles.success}>{forgotPasswordMessage}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? "Sending..." : "Send Login Link"}
              </button>
            </Form>
          </Formik>

          <div className={styles.divider}>
            <div className={styles.line}></div>
            <span className={styles.orText}>OR</span>
            <div className={styles.line}></div>
          </div>

          <button
            onClick={() => setShowForgotPassword(false)}
            className={styles.linkButton}
          >
            Back to Login
          </button>
        </div>

        <div className={styles.switchForm}>
          <span>Don't have an account? </span>
          <button onClick={onSignupClick} className={styles.linkButton}>
            Sign up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.form}>
        <h1 className={styles.logo}>Instagram</h1>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <FormikInput
              name="email"
              type="email"
              placeholder="Phone number, username or email address"
            />
            <FormikInput
              name="password"
              type="password"
              placeholder="Password"
              showPasswordToggle
            />

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </Form>
        </Formik>

        <SocialLogin />

        <button
          onClick={() => setShowForgotPassword(true)}
          className={styles.linkButton}
        >
          Forgotten your password?
        </button>
      </div>

      <div className={styles.switchForm}>
        <span>Don't have an account? </span>
        <button onClick={onSignupClick} className={styles.linkButton}>
          Sign up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
