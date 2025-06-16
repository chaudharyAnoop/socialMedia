import React from 'react';
import { Formik, Form } from 'formik';
import { useAuth } from '../../contexts/AuthContext';
import { otpValidationSchema } from '../../utils/validationSchemas';
import FormikInput from '../FormInput/FormikInput';
import { Mail } from 'lucide-react';
import styles from '../AuthForm/AuthForm.module.css';

interface OTPVerificationProps {
  email: string;
  onBack: () => void;
}

interface OTPFormValues {
  otp: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onBack }) => {
  const { verifyOTP } = useAuth();

  const initialValues: OTPFormValues = {
    otp: '',
  };

  const handleSubmit = async (
    values: OTPFormValues,
    { setSubmitting, setStatus }: { setSubmitting: (isSubmitting: boolean) => void; setStatus: (status: any) => void }
  ) => {
    setStatus(null);
    
    try {
      const result = await verifyOTP(email, values.otp);
      
      if (!result.success) {
        setStatus(result.message || 'Invalid verification code. Please try again.');
      }
      // If successful, the AuthContext will handle the state change
    } catch (error) {
      setStatus('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = () => {
    // In a real app, this would resend the OTP
    alert('Verification code resent to ' + email);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authWrapper}>
        <div className={styles.authBox}>
          <div className={styles.otpContainer}>
            <div className={styles.otpIcon}>
              <Mail />
            </div>
            
            <h2 className={styles.otpTitle}>Enter confirmation code</h2>
            
            <p className={styles.otpDescription}>
              Enter the confirmation code that we sent to{' '}
              <strong>{email}</strong>.{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); handleResendCode(); }}>
                Resend code.
              </a>
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={otpValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, isValid, dirty, status }) => (
                <Form className={styles.form}>
                  {status && (
                    <div className={styles.errorMessage}>{status}</div>
                  )}

                  <FormikInput
                    type="text"
                    name="otp"
                    placeholder="Confirmation code"
                    autoComplete="one-time-code"
                  />

                  <button
                    type="submit"
                    className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
                    disabled={!isValid || !dirty || isSubmitting}
                  >
                    {isSubmitting && <div className={styles.spinner}></div>}
                    Next
                  </button>
                </Form>
              )}
            </Formik>

            <button className={styles.backButton} onClick={onBack}>
              Go back
            </button>
          </div>
        </div>

        <div className={styles.switchBox}>
          Have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>
            Log in
          </a>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;