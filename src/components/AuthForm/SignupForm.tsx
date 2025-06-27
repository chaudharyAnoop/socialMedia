import React, { useState } from "react";

import { Formik, Form } from "formik";
import { AxiosError } from "axios";

import { useAuth } from "../../contexts/AuthContext";
import { registerSchema } from "../../utils/validationSchemas";

import FormikInput from "../FormInput/FormikInput";
import SocialLogin from "../SocialLogin/SocialLogin";
import PasswordStrength from "../PasswordStrength/PasswordStrength";
import styles from "./AuthForm.module.css";

interface SignupFormProps {
  onLoginClick: () => void;
  onSignupSuccess: (email: string) => void;
}

interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  username: string;
  bio?: string;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onLoginClick,
  onSignupSuccess,
}) => {
  const { register, loading } = useAuth();
  const [error, setError] = useState("");
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const handleSignup = async (values: SignupFormValues) => {
    setError("");
    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        bio: values.bio,
        isPrivate: false,
      });
      onSignupSuccess(values.email);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.form}>
        <h1 className={styles.logo}>Instagram</h1>
        <p className={styles.subtitle}>
          Sign up to see photos and videos from your friends.
        </p>

        <SocialLogin />

        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
            fullName: "",
            username: "",
            bio: "",
          }}
          validationSchema={registerSchema}
          onSubmit={handleSignup}
        >
          {({ values }) => (
            <Form>
              <FormikInput
                name="email"
                type="email"
                placeholder="Mobile number or email address"
              />
              <FormikInput
                name="password"
                type="password"
                placeholder="Password"
                showPasswordToggle
                onFocus={() => setShowPasswordStrength(true)}
                onBlur={() => setShowPasswordStrength(false)}
              />
              <PasswordStrength
                password={values.password}
                showStrength={showPasswordStrength}
              />
              <FormikInput
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                showPasswordToggle
              />
              <FormikInput
                name="fullName"
                type="text"
                placeholder="Full Name"
              />
              <FormikInput name="username" type="text" placeholder="Username" />
              <FormikInput
                name="bio"
                type="text"
                placeholder="Bio (optional)"
              />

              {error && <div className={styles.error}>{error}</div>}

              <p className={styles.terms}>
                By signing up, you agree to our{" "}
                <a href="#" className={styles.link}>
                  Terms
                </a>
                .
              </p>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <div className={styles.switchForm}>
        <span>Have an account? </span>
        <button onClick={onLoginClick} className={styles.linkButton}>
          Log in
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
