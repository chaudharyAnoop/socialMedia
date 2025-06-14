import * as Yup from 'yup';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9._]+$/;
  return username.length >= 3 && username.length <= 30 && usernameRegex.test(username);
};

export const validateFullName = (fullName: string): boolean => {
  return fullName.trim().length >= 2;
};

export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

// Yup validation schemas for Formik
export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const signupValidationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .matches(
      /^[a-zA-Z0-9._]+$/,
      'Username can only contain letters, numbers, dots, and underscores'
    )
    .required('Username is required'),
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  bio: Yup.string().max(150, 'Bio must be less than 150 characters'),
});

export const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, 'Please enter a valid 6-digit code')
    .required('Confirmation code is required'),
});

// Legacy validation functions for backward compatibility
export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSignupForm = (formData: {
  email: string;
  username: string;
  fullName: string;
  password: string;
  bio?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.username) {
    errors.username = 'Username is required';
  } else if (!validateUsername(formData.username)) {
    errors.username = 'Username must be 3-30 characters and contain only letters, numbers, dots, and underscores';
  }

  if (!formData.fullName) {
    errors.fullName = 'Full name is required';
  } else if (!validateFullName(formData.fullName)) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};