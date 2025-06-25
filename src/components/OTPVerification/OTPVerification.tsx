import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import FormikInput from "../FormInput/FormikInput";
import { otpSchema } from "../../utils/validationSchemas";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./OTPVerification.module.css";

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerified,
  onBack,
}) => {
  const { verifyOTP, resendOTP, loading } = useAuth();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    values: { otp: string },
    { setSubmitting }: any
  ) => {
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // For email verification during registration
      await verifyOTP(email, values.otp);
      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        onVerified();
      }, 1500);
    } catch (error: any) {
      // Stay on the same page and show error - DO NOT redirect
      const errorMessage =
        error.response?.data?.message ||
        "Invalid OTP. Please check your code and try again.";
      setError(errorMessage);
      console.error("OTP Verification Error:", error);
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
      await resendOTP(email);
      console.log("Resending OTP to:", email);
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
      setCanResend(true);
      setTimer(0);
    }
  };

  return (
    <div className={styles.otpContainer}>
      <h1 className={styles.logo}>Instagram</h1>

      <div className={styles.subtitle}>
        Enter the 6-digit code we sent to
        <br />
        <span className={styles.emailHighlight}>{email}</span>
      </div>

      <Formik
        initialValues={{ otp: "" }}
        validationSchema={otpSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormikInput
              name="otp"
              type="text"
              placeholder="6-digit code"
              maxLength={6}
            />

            {error && <div className={styles.error}>{error}</div>}

            {success && <div className={styles.success}>{success}</div>}

            <button
              type="submit"
              disabled={loading || isSubmitting}
              className={styles.submitButton}
            >
              {loading || isSubmitting ? "Verifying..." : "Verify"}
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
        Back to sign up
      </button>
    </div>
  );
};

export default OTPVerification;
