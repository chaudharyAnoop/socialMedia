// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import axios from "axios";
// import { Navigate } from "react-router-dom";
// import { token as ftoken } from "../firebase/firebase";

// interface User {
//   id: string;
//   email: string;
//   username: string;
//   fullName: string;
//   bio?: string;
//   profilePicture?: string;
//   isPrivate: boolean;
//   isVerified?: boolean;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<any>;
//   register: (userData: RegisterData) => Promise<any>;
//   verifyOTP: (email: string, otp: string) => Promise<any>;
//   forgotPassword: (email: string) => Promise<any>;
//   resetPassword: (
//     email: string,
//     otp: string,
//     newPassword: string
//   ) => Promise<any>;
//   logout: () => void;
//   loading: boolean;
//   checkAuthStatus: () => Promise<void>;
// }

// interface RegisterData {
//   username: string;
//   email: string;
//   password: string;
//   fullName: string;
//   bio?: string;
//   profilePicture?: string;
//   isPrivate: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const API_BASE_URL = "http://172.50.5.102:3011";

// // Configure axios defaults
// axios.defaults.baseURL = API_BASE_URL;
// axios.defaults.timeout = 10000;

// // Generate a unique device ID
// const generateDeviceId = () => {
//   let deviceId = localStorage.getItem("deviceId");
//   if (!deviceId) {
//     deviceId =
//       "device-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now();
//     localStorage.setItem("deviceId", deviceId);
//   }
//   return deviceId;
// };

// // Get client IP address (approximation)
// const getClientIP = async () => {
//   try {
//     const response = await fetch("https://api.ipify.org?format=json");
//     const data = await response.json();
//     return data.ip;
//   } catch (error) {
//     return "127.0.0.1";
//   }
// };

// // JWT token decoder (simple implementation)
// const decodeJWT = (token: string) => {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map(function (c) {
//           return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//         })
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error("Error decoding JWT:", error);
//     return null;
//   }
// };

// // Check if token is expired
// const isTokenExpired = (token: string) => {
//   try {
//     const decoded = decodeJWT(token);
//     if (!decoded || !decoded.exp) return true;
//     return Date.now() >= decoded.exp * 1000;
//   } catch (error) {
//     return true;
//   }
// };

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [isLoading, setIsLoading] = useState(true); // Initial loading state

//   const isAuthenticated = !!user;

//   // Check authentication status on app load
//   const checkAuthStatus = async () => {
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token || isTokenExpired(token)) {
//         // Token doesn't exist or is expired
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         delete axios.defaults.headers.common["Authorization"];
//         setUser(null);
//         return;
//       }

//       // Set authorization header
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//       // Try to get user profile to validate token
//       try {
//         // You might need to adjust this endpoint based on your API
//         const response = await axios.get("/users/me");
//         setUser(response.data.user || response.data);
//       } catch (error) {
//         // If profile fetch fails, try to decode user info from JWT
//         const decoded = decodeJWT(token);
//         if (decoded) {
//           setUser({
//             id: decoded.sub || decoded.userId || decoded.id,
//             email: decoded.email,
//             username: decoded.username || decoded.email.split("@")[0],
//             fullName: decoded.fullName || decoded.name || "User",
//             isPrivate: decoded.isPrivate || false,
//             bio: decoded.bio,
//             profilePicture: decoded.profilePicture,
//             isVerified: decoded.isVerified || false,
//           });
//         } else {
//           // Invalid token
//           localStorage.removeItem("access_token");
//           localStorage.removeItem("refresh_token");
//           delete axios.defaults.headers.common["Authorization"];
//           setUser(null);
//         }
//       }
//     } catch (error) {
//       console.error("Auth check failed:", error);
//       setUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   // Axios interceptor for handling token refresh
//   useEffect(() => {
//     const interceptor = axios.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;

//           const refreshToken = localStorage.getItem("refresh_token");
//           if (refreshToken) {
//             // try {
//             //   // Adjusted refresh token endpoint path to /auth/token/refresh
//             //   const response = await axios.post("/auth/token/refresh", {
//             //     refresh_token: refreshToken,
//             //   });
//             //   const { access_token } = response.data;
//             //   localStorage.setItem("access_token", access_token);
//             //   axios.defaults.headers.common[
//             //     "Authorization"
//             //   ] = `Bearer ${access_token}`;
//             //   return axios(originalRequest);
//             // } catch (refreshError) {
//             //   // Refresh failed, logout user
//             //   logout();
//             //   return Promise.reject(refreshError);
//             // }
//           } else {
//             logout();
//           }
//         }

//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axios.interceptors.response.eject(interceptor);
//     };
//   }, []);

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     try {
//       const deviceId = generateDeviceId();
//       const ipAddress = await getClientIP();
//       const userAgent = navigator.userAgent;
//       const firetoken = ftoken;

//       const response = await axios.post("/auth/login", {
//         email,
//         password,
//         fcmToken: firetoken, // Default for web
//         deviceId,
//         ipAddress,
//         userAgent,
//       });

//       const { access_token, refresh_token, user: userData } = response.data;

//       // Store tokens
//       localStorage.setItem("access_token", access_token);
//       localStorage.setItem("refresh_token", refresh_token);
//       console.log("👤 Current user:", user);
//       localStorage.setItem("instagram_user", access_token);

//       // Set authorization header
//       //******************************* */ axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

//       // Set user data from response or decode from JWT
//       if (userData) {
//         setUser(userData);
//       } else {
//         const decoded = decodeJWT(access_token);
//         if (decoded) {
//           setUser({
//             id: decoded.sub || decoded.userId || decoded.id,
//             email: decoded.email || email,
//             username: decoded.username || email.split("@")[0],
//             fullName: decoded.fullName || decoded.name || "User",
//             isPrivate: decoded.isPrivate || false,
//             bio: decoded.bio,
//             profilePicture: decoded.profilePicture,
//             isVerified: decoded.isVerified || false,
//           });
//         }
//       }
//       console.log(user);

//       return response.data;
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (userData: RegisterData) => {
//     setLoading(true);
//     try {
//       const response = await axios.post("/auth/register", {
//         ...userData,
//         isPrivate: userData.isPrivate || false,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Registration error:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOTP = async (email: string, otp: string) => {
//     setLoading(true);
//     try {
//       const response = await axios.post("/auth/verify-otp", {
//         email,
//         otp,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("OTP verification error:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const forgotPassword = async (email: string) => {
//     setLoading(true);
//     try {
//       const response = await axios.post("/auth/forgot-password", {
//         email,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Forgot password error:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetPassword = async (
//     email: string,
//     otp: string,
//     newPassword: string
//   ) => {
//     setLoading(true);
//     try {
//       const response = await axios.post("/auth/reset-password", {
//         email,
//         otp,
//         newPassword,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Password reset error:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     delete axios.defaults.headers.common["Authorization"];
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated,
//         isLoading,
//         login,
//         register,
//         verifyOTP,
//         forgotPassword,
//         resetPassword,
//         logout,
//         loading,
//         checkAuthStatus,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };


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

interface AuthProviderProps {
  children: ReactNode;
}
