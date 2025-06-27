import React, { useEffect, useReducer } from "react";

import { Formik, Form } from "formik";
import { AxiosError } from "axios";

import { useAuth } from "../../contexts/AuthContext";
import { otpSchema } from "../../utils/validationSchemas";

import FormikInput from "../FormInput/FormikInput";
import styles from "./OTPVerification.module.css";

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

interface OTPState {
  timer: number;
  canResend: boolean;
  error: string;
  success: string;
}

type OTPAction =
  | { type: "SET_TIMER"; payload: number }
  | { type: "SET_CAN_RESEND"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_SUCCESS"; payload: string }
  | { type: "RESET_STATE" };

const initialState: OTPState = {
  timer: 60,
  canResend: false,
  error: "",
  success: "",
};

function otpReducer(state: OTPState, action: OTPAction): OTPState {
  switch (action.type) {
    case "SET_TIMER":
      return { ...state, timer: action.payload };
    case "SET_CAN_RESEND":
      return { ...state, canResend: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, success: "" };
    case "SET_SUCCESS":
      return { ...state, success: action.payload, error: "" };
    case "RESET_STATE":
      return { ...initialState, timer: state.timer };
    default:
      return state;
  }
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerified,
  onBack,
}) => {
  const { verifyOTP, resendOTP, loading } = useAuth();
  const [state, dispatch] = useReducer(otpReducer, initialState);

  useEffect(() => {
    if (state.timer > 0) {
      const interval = setInterval(() => {
        dispatch({ type: "SET_TIMER", payload: state.timer - 1 });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      dispatch({ type: "SET_CAN_RESEND", payload: true });
    }
  }, [state.timer]);

  const handleSubmit = async (
    values: { otp: string },
    { setSubmitting }: import("formik").FormikHelpers<{ otp: string }>
  ) => {
    // Clear previous error before submitting
    dispatch({ type: "SET_ERROR", payload: "" });

    try {
      await verifyOTP(email, values.otp);
      dispatch({
        type: "SET_SUCCESS",
        payload: "Email verified successfully! Redirecting to login...",
      });
      setTimeout(() => {
        onVerified();
      }, 1500);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Invalid OTP. Please check your code and try again.";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      console.error("OTP Verification Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    dispatch({ type: "SET_TIMER", payload: 60 });
    dispatch({ type: "SET_CAN_RESEND", payload: false });
    dispatch({ type: "SET_SUCCESS", payload: "New OTP sent to your email" });

    try {
      await resendOTP(email);
      console.log("Resending OTP to:", email);
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to resend OTP. Please try again.",
      });
      dispatch({ type: "SET_CAN_RESEND", payload: true });
      dispatch({ type: "SET_TIMER", payload: 0 });
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

            {state.error && <div className={styles.error}>{state.error}</div>}
            {state.success && (
              <div className={styles.success}>{state.success}</div>
            )}

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
        {state.canResend ? (
          <button
            onClick={handleResend}
            className={styles.resendButton}
            disabled={loading}
          >
            Resend code
          </button>
        ) : (
          <div className={styles.resendText}>Resend code in {state.timer}s</div>
        )}
      </div>

      <button onClick={onBack} className={styles.backButton}>
        Back to sign up
      </button>
    </div>
  );
};

export default OTPVerification;
