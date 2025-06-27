import React, { useEffect, Suspense, lazy } from "react";

import styles from "./App.module.css";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import {
  onFirebaseMessage,
  requestNotificationPermission,
} from "./firebase/firebase";

import Router from "./Router/Router";

const AppContent: React.FC = () => {
  return (
    <div className={styles.nav}>
      {/* <BrowserRouter> */}
      <Router />
      {/* </BrowserRouter> */}
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    requestNotificationPermission();
    onFirebaseMessage();
  }, []);

  return (
    <AuthProvider>
      <div className={styles.main}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;
