import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    bio?: string;
    profilePicture?: string;
    provider?: "email" | "google" | "facebook" | "apple";
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (userData: SignupData) => Promise<void>;
    socialLogin: (provider: "google" | "facebook" | "apple") => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

interface SignupData {
    username: string;
    email: string;
    password: string;
    fullName: string;
    bio?: string;
    profilePicture?: File;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Simulate authentication logic
            if (email === "demo@instagram.com" && password === "password123") {
                const userData: User = {
                    id: "1",
                    username: "demo_user",
                    email: email,
                    fullName: "Demo User",
                    bio: "Welcome to my Instagram profile!",
                    profilePicture:
                        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150&h=150&fit=crop&crop=faces",
                    provider: "email",
                };
                setUser(userData);
                localStorage.setItem("auth_token", "demo_token_123");
            } else {
                throw new Error("Invalid email or password");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signup = useCallback(async (userData: SignupData) => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Simulate user creation
            const newUser: User = {
                id: Date.now().toString(),
                username: userData.username,
                email: userData.email,
                fullName: userData.fullName,
                bio: userData.bio,
                profilePicture: userData.profilePicture
                    ? URL.createObjectURL(userData.profilePicture)
                    : undefined,
                provider: "email",
            };

            setUser(newUser);
            localStorage.setItem("auth_token", `token_${newUser.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Signup failed");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const socialLogin = useCallback(
        async (provider: "google" | "facebook" | "apple") => {
            setIsLoading(true);
            setError(null);

            try {
                // Simulate OAuth flow
                await new Promise((resolve) => setTimeout(resolve, 2000));

                // Simulate successful social login
                const socialUsers = {
                    google: {
                        id: "google_123",
                        username: "john_doe_google",
                        email: "john.doe@gmail.com",
                        fullName: "John Doe",
                        bio: "Signed up with Google",
                        profilePicture:
                            "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150&h=150&fit=crop&crop=faces",
                        provider: "google" as const,
                    },
                    facebook: {
                        id: "facebook_456",
                        username: "jane_smith_fb",
                        email: "jane.smith@facebook.com",
                        fullName: "Jane Smith",
                        bio: "Connected via Facebook",
                        profilePicture:
                            "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=150&h=150&fit=crop&crop=faces",
                        provider: "facebook" as const,
                    },
                    apple: {
                        id: "apple_789",
                        username: "alex_apple",
                        email: "alex@icloud.com",
                        fullName: "Alex Johnson",
                        bio: "Sign in with Apple",
                        profilePicture:
                            "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150&h=150&fit=crop&crop=faces",
                        provider: "apple" as const,
                    },
                };

                const userData = socialUsers[provider];
                setUser(userData);
                localStorage.setItem(
                    "auth_token",
                    `${provider}_token_${userData.id}`
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : `${provider} login failed`
                );
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("auth_token");
    }, []);

    const value = {
        user,
        isLoading,
        error,
        login,
        signup,
        socialLogin,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
