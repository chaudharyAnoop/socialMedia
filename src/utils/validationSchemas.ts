import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const registerSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  fullName: Yup.string()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .matches(
      /^[a-zA-Z0-9._]+$/,
      "Username can only contain letters, numbers, dots, and underscores"
    )
    .required("Username is required"),
  bio: Yup.string().max(150, "Bio must be less than 150 characters"),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export const resetPasswordSchema = Yup.object({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .matches(/^[0-9]+$/, "OTP must contain only numbers")
    .required("OTP is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

export const otpSchema = Yup.object({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .matches(/^[0-9]+$/, "OTP must contain only numbers")
    .required("OTP is required"),
});
