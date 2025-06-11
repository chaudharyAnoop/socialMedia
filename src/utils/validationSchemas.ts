import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

export const signupSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name cannot exceed 50 characters')
    .required('Full name is required'),
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .matches(
      /^[a-zA-Z0-9._]+$/,
      'Username can only contain letters, numbers, periods, and underscores'
    )
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .matches(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/(?=.*\d)/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
  bio: Yup.string()
    .max(150, 'Bio cannot exceed 150 characters')
});

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let score = 0;
  
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/(?=.*[a-z])/.test(password)) score++;
  if (/(?=.*[A-Z])/.test(password)) score++;
  if (/(?=.*\d)/.test(password)) score++;
  if (/(?=.*[!@#$%^&*])/.test(password)) score++;
  
  if (score < 3) return 'weak';
  if (score < 5) return 'medium';
  return 'strong';
};