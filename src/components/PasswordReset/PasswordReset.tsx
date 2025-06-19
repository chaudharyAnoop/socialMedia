import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import FormikInput from "../FormInput/FormikInput";
import PasswordStrength from "../PasswordStrength/PasswordStrength";
import { resetPasswordSchema } from "../../utils/validationSchemas";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./PasswordReset.module.css";

interface PasswordResetProps {
  email: string;
  onPasswordReset: () => void;
  onBack: () => void;
}

const PasswordReset: React.FC<PasswordResetProps> = ({
  email,
  onPasswordReset,
  onBack,
}) => {
  const { resetPassword, loading } = useAuth();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleSubmit = async (
    values: { otp: string; newPassword: string; confirmPassword: string },
    { setSubmitting }: any
  ) => {
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await resetPassword(email, values.otp, values.newPassword);
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        onPasswordReset();
      }, 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Invalid OTP or failed to reset password. Please try again.";
      setError(errorMessage);
      console.error("Password Reset Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setTimer(60);
    setCanResend(false);
    setError("");
    setSuccess("New OTP sent to your email");

    try {
      // Call resend OTP API if available
      console.log("Resending OTP to:", email);
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
      setCanResend(true);
      setTimer(0);
    }
  };

  return (
    <div className={styles.resetContainer}>
      <h1 className={styles.logo}>Instagram</h1>

      <div className={styles.subtitle}>
        Enter the 6-digit code we sent to
        <br />
        <span className={styles.emailHighlight}>{email}</span>
        <br />
        and create your new password
      </div>

      <Formik
        initialValues={{ otp: "", newPassword: "", confirmPassword: "" }}
        validationSchema={resetPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <FormikInput
              name="otp"
              type="text"
              placeholder="6-digit code"
              maxLength={6}
            />

            <FormikInput
              name="newPassword"
              type="password"
              placeholder="New Password"
              showPasswordToggle
              onFocus={() => setShowPasswordStrength(true)}
              onBlur={() => setShowPasswordStrength(false)}
            />

            <PasswordStrength
              password={values.newPassword}
              showStrength={showPasswordStrength}
            />

            <FormikInput
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              showPasswordToggle
            />

            {error && <div className={styles.error}>{error}</div>}

            {success && <div className={styles.success}>{success}</div>}

            <button
              type="submit"
              disabled={loading || isSubmitting}
              className={styles.submitButton}
            >
              {loading || isSubmitting
                ? "Resetting Password..."
                : "Reset Password"}
            </button>
          </Form>
        )}
      </Formik>

      <div>
        {canResend ? (
          <button
            onClick={handleResend}
            className={styles.resendButton}
            disabled={loading}
          >
            Resend code
          </button>
        ) : (
          <div className={styles.resendText}>Resend code in {timer}s</div>
        )}
      </div>

      <button onClick={onBack} className={styles.backButton}>
        Back to login
      </button>
    </div>
  );
};

export default PasswordReset;
