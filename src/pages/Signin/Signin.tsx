import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { LoginForm } from "../../components/AuthForm/LoginForm";
import { SignupForm } from "../../components/AuthForm/SignupForm";
import { Dashboard } from "../../components/Dashboard/Dashboard";
// import { Dashboard } from "./components/Dashboard/Dashboard";


const AuthPages: React.FC = () => {
    const { user } = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);

    // If user is authenticated, show dashboard
    if (user) {
        return <Dashboard />;
    }

    // Show authentication forms
    return (
        <>
            {isLoginMode ? (
                <LoginForm onSwitchToSignup={() => setIsLoginMode(false)} />
            ) : (
                <SignupForm onSwitchToLogin={() => setIsLoginMode(true)} />
            )}
        </>
    );
};

function Signin() {
    useEffect(() => {
        // Check for existing auth token on app load
        const token = localStorage.getItem("auth_token");
        if (token) {
            // In a real app, you would validate the token with your backend
            console.log("Existing auth token found:", token);
        }
    }, []);

    return (
        <AuthProvider>
            <AuthPages />
        </AuthProvider>
    );
}

export default Signin;
