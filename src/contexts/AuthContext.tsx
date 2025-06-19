import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

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
