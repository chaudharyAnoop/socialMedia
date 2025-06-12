import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/AuthForm/LoginForm';
import SignupForm from '../../components/AuthForm/SignupForm';;
import Dashboard from '../../components/Dashboard/Dashboard';
import OTPVerification from '../../components/OTPVerification/OTPVerification';
import './Signin.css';

type AuthView = 'login' | 'signup' | 'otp';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [otpEmail, setOtpEmail] = useState('');

  const handleSwitchToSignup = () => setCurrentView('signup');
  const handleSwitchToLogin = () => setCurrentView('login');
  const handleShowOTP = (email: string) => {
    setOtpEmail(email);
    setCurrentView('otp');
  };
  const handleBackFromOTP = () => setCurrentView('login');

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-secondary)'
      }}>
        <div style={{ 
          width: '24px', 
          height: '24px', 
          border: '2px solid var(--border-color)', 
          borderTop: '2px solid var(--button-primary)', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  if (currentView === 'otp') {
    return (
      <OTPVerification
        email={otpEmail}
        onBack={handleBackFromOTP}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <SignupForm
        onSwitchToLogin={handleSwitchToLogin}
        onShowOTP={handleShowOTP}
      />
    );
  }

  return (
    <LoginForm
      onSwitchToSignup={handleSwitchToSignup}
      onShowOTP={handleShowOTP}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;