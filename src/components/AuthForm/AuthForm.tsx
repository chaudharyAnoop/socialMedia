import React, { useState } from "react";

import styles from "./AuthForm.module.css";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import OTPVerification from "../OTPVerification/OTPVerification";
import PasswordReset from "../PasswordReset/PasswordReset";

type AuthView =
  | "login"
  | "signup"
  | "otp"
  | "forgot-password"
  | "reset-password";

const AuthForm: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleSignupSuccess = (email: string) => {
    setRegistrationEmail(email);
    setCurrentView("otp");
  };

  const handleOTPVerified = () => {
    setCurrentView("login");
  };

  const handleForgotPassword = (email: string) => {
    setForgotPasswordEmail(email);
    setCurrentView("reset-password");
  };

  const handlePasswordResetComplete = () => {
    setCurrentView("login");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  const handleBackToSignup = () => {
    setCurrentView("signup");
  };

  return (
    <div className={styles.authContainer}>
      {currentView === "login" && (
        <LoginForm
          onSignupClick={() => setCurrentView("signup")}
          onForgotPassword={handleForgotPassword}
        />
      )}

      {currentView === "signup" && (
        <SignupForm
          onLoginClick={() => setCurrentView("login")}
          onSignupSuccess={handleSignupSuccess}
        />
      )}

      {currentView === "otp" && (
        <OTPVerification
          email={registrationEmail}
          onVerified={handleOTPVerified}
          onBack={handleBackToSignup}
        />
      )}

      {currentView === "reset-password" && (
        <PasswordReset
          email={forgotPasswordEmail}
          onPasswordReset={handlePasswordResetComplete}
          onBack={handleBackToLogin}
        />
      )}
    </div>
  );
};

export default AuthForm;
