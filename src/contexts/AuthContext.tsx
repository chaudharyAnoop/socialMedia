import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { token as sfcmToken } from "../firebase/firebase";
interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  profilePicture?: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string; requiresOTP?: boolean }>;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; message?: string; requiresOTP?: boolean }>;
  verifyOTP: (
    email: string,
    otp: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  bio?: string;
  profilePicture?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  // const login = async (email: string, password: string) => {
  //   try {
  //     const response = await fetch("http://172.50.5.102:3011/auth/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();
  //     console.log(data);

  //     if (response.ok) {
  //       if (data.requiresOTP) {
  //         return { success: true, requiresOTP: true };
  //       }

  //       setUser(data.access_token);
  //       localStorage.setItem(
  //         "instagram_user",
  //         JSON.stringify(data.access_token)
  //       );
  //       return { success: true };
  //     } else {
  //       return { success: false, message: data.message || "Login failed" };
  //     }
  //   } catch (error) {
  //     // Mock successful login for demo purposes
  //     const mockUser: User = {
  //       id: "1",
  //       username: email.split("@")[0],
  //       email,
  //       fullName: "Demo User",
  //       bio: "Welcome to Instagram clone!",
  //       profilePicture: "",
  //       emailVerified: true,
  //     };

  //     setUser(mockUser);
  //     localStorage.setItem("instagram_user", JSON.stringify(mockUser));
  //     return { success: true };
  //   }
  // };
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Generate a device ID (you can use any method to generate a unique ID)
      const deviceId = generateDeviceId();
      // Get client IP address (this is a simplified version)
      const ipAddress = await getClientIP();
      const userAgent = navigator.userAgent;
      console.log(sfcmToken);
      const response = await fetch("http://172.50.5.102:3011/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password,
          deviceId,
          ipAddress,
          userAgent,
          fcmToken: sfcmToken // Default for web
        }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        if (data.requiresOTP) {
          return { success: true, requiresOTP: true };
        }
  
        setUser(data.access_token);
        localStorage.setItem(
          "instagram_user",
          JSON.stringify(data.access_token)
        );
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Network error occurred" };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to generate a device ID
  const generateDeviceId = (): string => {
    // You can implement a more sophisticated device ID generation
    // This is a simple version using browser fingerprinting
    const navigatorInfo = `${navigator.userAgent}${navigator.hardwareConcurrency}${screen.width}${screen.height}`;
    return btoa(navigatorInfo).substring(0, 32);
  };
  
  // Helper function to get client IP (simplified version)
  const getClientIP = async (): Promise<string> => {
    try {
      // This is a simple approach - in production you might want to:
      // 1. Get the IP from your backend during initial page load
      // 2. Or use a third-party service
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch (error) {
      console.error("Could not get IP address:", error);
      return 'unknown';
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
        // localStorage.setItem("instagram_user", JSON.stringify(mockUser));
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
      // localStorage.setItem("instagram_user", JSON.stringify(mockUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    // localStorage.removeItem("instagram_user");
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
