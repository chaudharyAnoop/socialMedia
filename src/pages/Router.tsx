import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import { ToastContainer } from "react-toastify";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import QuickAccess from "./components/QuickAccess/QuickAccess";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard/Dashboard";
import Signin from "./pages/Signin/Signin";
import ExplorePage from "./pages/explore/ExplorePage";
import InstagramCreatePost from "./pages/InstagramCreatePost/InstagramCreatePost";
import NotificationsPage from "./pages/notifications/NotificationsPage/NotificationsPage";
import ChatLayout from "./components/Chat/ChatLayout";

const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const AdminPage = lazy(() => import("./pages/AdminPage/AdminPage"));

const Router: React.FC = () => {
  const location = useLocation();
  const isSignin = location.pathname === "/signin";

  return (
    <div className={styles.nav}>
      {!isSignin && <NavigationBar />}
      <Suspense fallback={<div aria-busy="true" style={{ display: "none" }} />}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <ExplorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <InstagramCreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatLayout />
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/noti"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {!isSignin && <QuickAccess />}
    </div>
  );
};

export default Router;
