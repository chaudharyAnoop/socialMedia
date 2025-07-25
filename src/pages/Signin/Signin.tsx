import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";

function Signin() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "yellow",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            border: "2px solid var(--border-color)",
            borderTop: "2px solid var(--button-primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AuthForm />
    </div>
  );
}

export default Signin;
