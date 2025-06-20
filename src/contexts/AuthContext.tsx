import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { token as ftoken } from "../firebase/firebase";

interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  bio?: string;
  profilePicture?: string;
  isPrivate: boolean;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: RegisterData) => Promise<any>;
  verifyOTP: (email: string, otp: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<any>;
  logout: () => void;
  loading: boolean;
  checkAuthStatus: () => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  bio?: string;
  profilePicture?: string;
  isPrivate: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "http://172.50.5.102:3011";

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 10000;

// Generate a unique device ID
const generateDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId =
      "device-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now();
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};

// Get client IP address (approximation)
const getClientIP = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return "127.0.0.1";
  }
};

// JWT token decoder (simple implementation)
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token: string) => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  const isAuthenticated = !!user;

  // Check authentication status on app load
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token || isTokenExpired(token)) {
        // Token doesn't exist or is expired
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        return;
      }

      // Set authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Try to get user profile to validate token
      try {
        // You might need to adjust this endpoint based on your API
        const response = await axios.get("/users/me");
        setUser(response.data.user || response.data);
      } catch (error) {
        // If profile fetch fails, try to decode user info from JWT
        const decoded = decodeJWT(token);
        if (decoded) {
          setUser({
            id: decoded.sub || decoded.userId || decoded.id,
            email: decoded.email,
            username: decoded.username || decoded.email.split("@")[0],
            fullName: decoded.fullName || decoded.name || "User",
            isPrivate: decoded.isPrivate || false,
            bio: decoded.bio,
            profilePicture: decoded.profilePicture,
            isVerified: decoded.isVerified || false,
          });
        } else {
          // Invalid token
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Axios interceptor for handling token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            // try {
            //   // Adjusted refresh token endpoint path to /auth/token/refresh
            //   const response = await axios.post("/auth/token/refresh", {
            //     refresh_token: refreshToken,
            //   });
            //   const { access_token } = response.data;
            //   localStorage.setItem("access_token", access_token);
            //   axios.defaults.headers.common[
            //     "Authorization"
            //   ] = `Bearer ${access_token}`;
            //   return axios(originalRequest);
            // } catch (refreshError) {
            //   // Refresh failed, logout user
            //   logout();
            //   return Promise.reject(refreshError);
            // }
          } else {
            logout();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const deviceId = generateDeviceId();
      const ipAddress = await getClientIP();
      const userAgent = navigator.userAgent;
      const firetoken = ftoken;

      const response = await axios.post("/auth/login", {
        email,
        password,
        fcmToken: firetoken, // Default for web
        deviceId,
        ipAddress,
        userAgent,
      });

      const { access_token, refresh_token, user: userData } = response.data;

      // Store tokens
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      console.log("👤 Current user:", user);
      localStorage.setItem("instagram_user", access_token);

      // Set authorization header
      //******************************* */ axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      // Set user data from response or decode from JWT
      if (userData) {
        setUser(userData);
      } else {
        const decoded = decodeJWT(access_token);
        if (decoded) {
          setUser({
            id: decoded.sub || decoded.userId || decoded.id,
            email: decoded.email || email,
            username: decoded.username || email.split("@")[0],
            fullName: decoded.fullName || decoded.name || "User",
            isPrivate: decoded.isPrivate || false,
            bio: decoded.bio,
            profilePicture: decoded.profilePicture,
            isVerified: decoded.isVerified || false,
          });
        }
      }
      console.log(user);

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const response = await axios.post("/auth/register", {
        ...userData,
        isPrivate: userData.isPrivate || false,
      });
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    setLoading(true);
    try {
      const response = await axios.post("/auth/verify-otp", {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      const response = await axios.post("/auth/forgot-password", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string
  ) => {
    setLoading(true);
    try {
      const response = await axios.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        verifyOTP,
        forgotPassword,
        resetPassword,
        logout,
        loading,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
<<<<<<< HEAD

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("instagram_user");
    

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("instagram_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://172.50.5.102:3011/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        if (data.requiresOTP) {
          return { success: true, requiresOTP: true };
        }

        setUser(data.accessToken);
        localStorage.setItem(
          "instagram_user",
          JSON.stringify(data.accessToken)
        );
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      // Mock successful login for demo purposes
      const mockUser: User = {
        id: "1",
        username: email.split("@")[0],
        email,
        fullName: "Demo User",
        bio: "Welcome to Instagram clone!",
        profilePicture: "",
        emailVerified: true,
      };

      setUser(mockUser);
      localStorage.setItem("instagram_user", JSON.stringify(mockUser));
      return { success: true };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userData,
          emailVerified: false,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        return { success: true, requiresOTP: true };
      } else {
        return {
          success: false,
          message: data.message || "Registration failed",
        };
      }
    } catch (error) {
      // Mock successful registration for demo purposes
      return { success: true, requiresOTP: true };
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await fetch("/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        const mockUser: User = {
          id: "1",
          username: email.split("@")[0],
          email,
          fullName: "New User",
          bio: "Welcome to Instagram!",
          profilePicture: "",
          emailVerified: true,
        };

        setUser(mockUser);
        localStorage.setItem("instagram_user", JSON.stringify(mockUser));
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || "OTP verification failed",
        };
      }
    } catch (error) {
      // Mock successful OTP verification for demo purposes
      const mockUser: User = {
        id: "1",
        username: email.split("@")[0],
        email,
        fullName: "New User",
        bio: "Welcome to Instagram!",
        profilePicture: "",
        emailVerified: true,
      };

      setUser(mockUser);
      localStorage.setItem("instagram_user", JSON.stringify(mockUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("instagram_user");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    verifyOTP,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   type ReactNode,
// } from "react";

// // 1. Merged User Interface:
// //    File 2's User interface is richer and includes all fields from File 1 (id, username, email).
// //    We're keeping the more comprehensive one.
// interface User {
//   id: string;
//   username: string;
//   email: string;
//   avatar?: string; // Kept from File 1 for potential backward compatibility, or remove if profilePicture is sufficient
//   fullName: string;
//   bio?: string;
//   profilePicture?: string;
//   emailVerified: boolean;
// }

// // Interface for registration data
// interface RegisterData {
//   username: string;
//   email: string;
//   password: string;
//   fullName: string;
//   bio?: string;
//   profilePicture?: string;
// }

// // 2. Merged AuthContextType:
// //    - Kept File 2's return types for login, register, verifyOTP as they are more informative.
// //      We will ensure the *implementation* of login handles errors by throwing, like File 1,
// //      so existing try/catch blocks still work.
// //    - Added register and verifyOTP from File 2.
// //    - Added isAuthenticated from File 2.
// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   // Login now returns an object, which is more robust.
//   // Existing code expecting void and handling errors via try/catch will still work
//   // because we'll throw an error if success is false.
//   login: (
//     email: string,
//     password: string
//   ) => Promise<{ success: boolean; message?: string; requiresOTP?: boolean }>;
//   register: (
//     userData: RegisterData
//   ) => Promise<{ success: boolean; message?: string; requiresOTP?: boolean }>;
//   verifyOTP: (
//     email: string,
//     otp: string
//   ) => Promise<{ success: boolean; message?: string }>;
//   logout: () => void;
//   isAuthenticated: boolean;
// }

// // Context creation - remains the same
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // useAuth hook - remains the same
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// // AuthProvider props - remains the same
// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // 3. Enhanced Initial Load Logic (combining File 1 and File 2's localStorage logic)
//     const savedInstagramUser = localStorage.getItem("instagram_user"); // File 2's key
//     const oldAuthToken = localStorage.getItem('authToken'); // File 1's key
//     const oldUserData = localStorage.getItem('userData'); // File 1's key

//     if (savedInstagramUser) {
//       // Prioritize File 2's newer storage format
//       try {
//         const parsedSession = JSON.parse(savedInstagramUser);
//         // Assuming instagram_user stores an object { user: UserObject, token: string }
//         if (parsedSession && parsedSession.user) {
//           setUser(parsedSession.user);
//         } else {
//           // If it's just a token string or malformed, clear it
//           console.warn("instagram_user found but no user object, clearing.");
//           localStorage.removeItem("instagram_user");
//         }
//       } catch (error) {
//         console.error("Failed to parse instagram_user:", error);
//         localStorage.removeItem("instagram_user");
//       }
//     } else if (oldAuthToken && oldUserData) {
//       // Fallback: Check for File 1's old keys
//       try {
//         const parsedOldUser = JSON.parse(oldUserData);
//         // Ensure the parsed user matches the new User interface minimums
//         if (parsedOldUser.id && parsedOldUser.username && parsedOldUser.email) {
//             setUser({
//                 ...parsedOldUser,
//                 fullName: parsedOldUser.fullName || parsedOldUser.username, // Provide a fallback for fullName
//                 emailVerified: parsedOldOldUser.emailVerified || true // Assume verified if from old system
//             });
//             // 4. Data Migration: Optionally, migrate old data to the new key
//             // This ensures future loads use the new 'instagram_user' key
//             localStorage.setItem("instagram_user", JSON.stringify({ user: parsedOldUser, token: oldAuthToken }));
//             // Clean up old keys after successful migration
//             localStorage.removeItem("authToken");
//             localStorage.removeItem("userData");
//         } else {
//             console.warn("Old user data found but incomplete, clearing.");
//             localStorage.removeItem("authToken");
//             localStorage.removeItem("userData");
//         }
//       } catch (error) {
//         console.error("Failed to parse old user data:", error);
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("userData");
//       }
//     }

//     setIsLoading(false);
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       // 5. Updated Login Endpoint & Logic (using File 2's endpoint, but adapted error handling)
//       const response = await fetch("http://172.50.5.102:3011/auth/login", { // File 2's specific IP
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       console.log("Login API Response:", data);

//       if (response.ok) {
//         if (data.requiresOTP) {
//           return { success: true, requiresOTP: true };
//         }

//         // 6. Handle successful login data
//         // Assume backend returns { user: UserObject, token: string }
//         if (data.user && data.token) {
//           setUser(data.user);
//           // Store combined user and token in the new 'instagram_user' key
//           localStorage.setItem("instagram_user", JSON.stringify({ user: data.user, token: data.token }));
//           return { success: true };
//         } else {
//           // If response is OK but data is missing user/token, treat as an error
//           const errorMessage = "Login successful but invalid data received (missing user or token).";
//           console.error(errorMessage, data);
//           throw new Error(errorMessage); // Throw like File 1
//         }
//       } else {
//         // 7. Error Handling: Throw an error like File 1 for non-OK responses
//         const errorMessage = data.message || "Login failed";
//         console.error("Login API Error:", errorMessage, data);
//         throw new Error(errorMessage);
//       }
//     } catch (error: any) {
//       console.error("Login caught error:", error);
//       // 8. IMPORTANT: Mock success for development/demo only (from File 2)
//       // REMOVE THIS CATCH BLOCK FOR PRODUCTION!
//       const mockUser: User = {
//         id: "mock-1",
//         username: email.split("@")[0] || "demoUser",
//         email,
//         fullName: "Demo User (Mock)",
//         bio: "Welcome to Instagram clone!",
//         profilePicture: "",
//         emailVerified: true,
//       };

//       setUser(mockUser);
//       localStorage.setItem("instagram_user", JSON.stringify({ user: mockUser, token: "mock_token_123" }));
//       return { success: true, message: "Mock login successful due to error." };
//       // For production, you would re-throw or return { success: false, message: error.message } here.
//       // throw error; // Uncomment this for production to propagate actual errors
//     }
//   };

//   const register = async (userData: RegisterData) => {
//     try {
//       // 9. Register Function (from File 2)
//       const response = await fetch("/auth/register", { // Relative path assumes proxy or same server
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...userData,
//           emailVerified: false, // Always false initially for new registrations
//         }),
//       });

//       const data = await response.json();
//       console.log("Register API Response:", data);

//       if (response.status === 201) { // 201 Created is typical for successful registration
//         return { success: true, requiresOTP: true, message: data.message || "Registration successful, please verify OTP." };
//       } else {
//         const errorMessage = data.message || "Registration failed";
//         console.error("Register API Error:", errorMessage, data);
//         throw new Error(errorMessage); // Throw error for non-201 responses
//       }
//     } catch (error: any) {
//       console.error("Register caught error:", error);
//       // 10. IMPORTANT: Mock success for development/demo only (from File 2)
//       // REMOVE THIS CATCH BLOCK FOR PRODUCTION!
//       return { success: true, requiresOTP: true, message: "Mock registration successful due to error." };
//       // For production, you would re-throw or return { success: false, message: error.message } here.
//       // throw error;
//     }
//   };

//   const verifyOTP = async (email: string, otp: string) => {
//     try {
//       // 11. Verify OTP Function (from File 2)
//       const response = await fetch("/auth/verify-otp", { // Relative path assumes proxy or same server
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await response.json();
//       console.log("Verify OTP API Response:", data);

//       if (response.ok) {
//         // If OTP is successful, the backend might return the full user object,
//         // or a token that needs to be used for a subsequent login.
//         // For simplicity here, we'll assume it means the user is now authenticated and verified.
//         // The mock user creation here is a placeholder for actual backend user data.
//         const verifiedUser: User = {
//           id: data.userId || "mock-verified-user", // Use actual ID from backend if available
//           username: email.split("@")[0] || "verifiedUser",
//           email,
//           fullName: "Verified User",
//           bio: "Account verified!",
//           profilePicture: "",
//           emailVerified: true, // This is the key update
//         };

//         setUser(verifiedUser);
//         // 12. Store verified user data.
//         // Note: In a real app, successful OTP might trigger a login flow to get an actual session token.
//         // For now, we'll store the user as if they're logged in.
//         localStorage.setItem("instagram_user", JSON.stringify({ user: verifiedUser, token: data.token || "mock_verified_token" }));
//         return { success: true, message: "OTP verification successful!" };
//       } else {
//         const errorMessage = data.message || "OTP verification failed";
//         console.error("Verify OTP API Error:", errorMessage, data);
//         throw new Error(errorMessage); // Throw error for non-OK responses
//       }
//     } catch (error: any) {
//       console.error("Verify OTP caught error:", error);
//       // 13. IMPORTANT: Mock success for development/demo only (from File 2)
//       // REMOVE THIS CATCH BLOCK FOR PRODUCTION!
//       const mockUser: User = {
//         id: "mock-otp-success",
//         username: email.split("@")[0] || "verifiedUserMock",
//         email,
//         fullName: "Verified User (Mock)",
//         bio: "Account verified by mock!",
//         profilePicture: "",
//         emailVerified: true,
//       };

//       setUser(mockUser);
//       localStorage.setItem("instagram_user", JSON.stringify({ user: mockUser, token: "mock_otp_token" }));
//       return { success: true, message: "Mock OTP verification successful due to error." };
//       // For production, you would re-throw or return { success: false, message: error.message } here.
//       // throw error;
//     }
//   };

//   const logout = () => {
//     // 14. Combined Logout Logic: Clear all relevant localStorage keys
//     setUser(null);
//     localStorage.removeItem("instagram_user"); // File 2's key
//     localStorage.removeItem("authToken");    // File 1's key
//     localStorage.removeItem("userData");     // File 1's key
//   };

//   const value: AuthContextType = {
//     user,
//     isLoading,
//     login,
//     register,
//     verifyOTP,
//     logout,
//     isAuthenticated: !!user, // From File 2
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
=======
>>>>>>> c45ee1c15efbc5ec464c9e39e433feb0f261c143
