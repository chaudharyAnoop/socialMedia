import React, { useEffect, useReducer } from "react";

import { Formik, Form, FormikHelpers } from "formik";
import { AxiosError } from "axios";

import { useAuth } from "../../contexts/AuthContext";
import { resetPasswordSchema } from "../../utils/validationSchemas";

import FormikInput from "../FormInput/FormikInput";
import PasswordStrength from "../PasswordStrength/PasswordStrength";
import styles from "./PasswordReset.module.css";

interface PasswordResetProps {
  email: string;
  onPasswordReset: () => void;
  onBack: () => void;
}

interface PasswordResetState {
  timer: number;
  canResend: boolean;
  error: string;
  success: string;
  showPasswordStrength: boolean;
}

type PasswordResetAction =
  | { type: "SET_TIMER"; payload: number }
  | { type: "SET_CAN_RESEND"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_SUCCESS"; payload: string }
  | { type: "SET_SHOW_PASSWORD_STRENGTH"; payload: boolean }
  | { type: "RESET_STATE" };

const initialState: PasswordResetState = {
  timer: 60,
  canResend: false,
  error: "",
  success: "",
  showPasswordStrength: false,
};

function passwordResetReducer(
  state: PasswordResetState,
  action: PasswordResetAction
): PasswordResetState {
  switch (action.type) {
    case "SET_TIMER":
      return { ...state, timer: action.payload };
    case "SET_CAN_RESEND":
      return { ...state, canResend: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, success: "" };
    case "SET_SUCCESS":
      return { ...state, success: action.payload, error: "" };
    case "SET_SHOW_PASSWORD_STRENGTH":
      return { ...state, showPasswordStrength: action.payload };
    case "RESET_STATE":
      return { ...initialState, timer: state.timer };
    default:
      return state;
  }
}

interface ResetFormValues {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordReset: React.FC<PasswordResetProps> = ({
  email,
  onPasswordReset,
  onBack,
}) => {
  const { resetPassword, loading } = useAuth();
  const [state, dispatch] = useReducer(passwordResetReducer, initialState);

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
    values: { otp: string; newPassword: string; confirmPassword: string },
    { setSubmitting }: FormikHelpers<ResetFormValues>
  ) => {
    dispatch({ type: "RESET_STATE" });
    setSubmitting(true);

    try {
      await resetPassword(email, values.otp, values.newPassword);
      dispatch({
        type: "SET_SUCCESS",
        payload: "Password reset successfully! Redirecting to login...",
      });
      setTimeout(() => {
        onPasswordReset();
      }, 1500);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Invalid OTP or failed to reset password. Please try again.";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      console.error("Password Reset Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    dispatch({ type: "SET_TIMER", payload: 60 });
    dispatch({ type: "SET_CAN_RESEND", payload: false });
    dispatch({ type: "SET_SUCCESS", payload: "New OTP sent to your email" });

    try {
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
              onFocus={() =>
                dispatch({ type: "SET_SHOW_PASSWORD_STRENGTH", payload: true })
              }
              onBlur={() =>
                dispatch({ type: "SET_SHOW_PASSWORD_STRENGTH", payload: false })
              }
            />

            <PasswordStrength
              password={values.newPassword}
              showStrength={state.showPasswordStrength}
            />

            <FormikInput
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              showPasswordToggle
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
              {loading || isSubmitting
                ? "Resetting Password..."
                : "Reset Password"}
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
        Back to login
      </button>
    </div>
  );
};

export default PasswordReset;
