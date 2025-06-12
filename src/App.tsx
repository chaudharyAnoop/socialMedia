// import { useState } from "react";
import styles from "./App.module.css";
import React , {useEffect} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar/NavigationBar";
// import LandingPage from "./pages/LandingPage/LandingPage";
import QuickAccess from "./components/QuickAccess/QuickAccess";
// import AdminPage from "./pages/AdminPage/AdminPage";
import { Suspense, lazy } from "react";
import RouteChangeHandler from "./components/RouteChangeHandler";
import ExplorePage from "./pages/explore/ExplorePage";
import { onFirebaseMessage, requestNotificationPermission } from "./firebase/firebase";

const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const AdminPage = lazy(() => import("./pages/AdminPage/AdminPage"));

function App() {
  // const [count, setCount] = useState(0);
  const App: React.FC = () => {
    useEffect(() => {
      requestNotificationPermission();
      onFirebaseMessage();
    }, []);

  return (
    <div className={styles.main}>
      <BrowserRouter>
        <div className={styles.nav}>
          <NavigationBar />
          {/* <RouteChangeHandler> */}
          <Suspense
            fallback={<div aria-busy="true" style={{ display: "none" }} />}
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<ExplorePage />} />
            </Routes>
          </Suspense>
          {/* </RouteChangeHandler> */}
          <QuickAccess />
        </div>
      </BrowserRouter>
    </div>
  );
}
}

export default App;
