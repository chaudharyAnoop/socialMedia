import styles from "./App.module.css";
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import QuickAccess from "./components/QuickAccess/QuickAccess";
import { Suspense, lazy } from "react";
import RouteChangeHandler from "./components/RouteChangeHandler";
import ExplorePage from "./pages/explore/ExplorePage";
import Signin from "./pages/Signin/Signin";
import {
  onFirebaseMessage,
  requestNotificationPermission,
} from "./firebase/firebase";
import InstagramCreatePost from "./pages/InstagramCreatePost/InstagramCreatePost";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard/Dashboard";

const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const AdminPage = lazy(() => import("./pages/AdminPage/AdminPage"));

// const App: React.FC = () => {
//   useEffect(() => {
//     requestNotificationPermission();
//     onFirebaseMessage();
//   }, []);

//   return (
//     <div className={styles.main}>
//       <BrowserRouter>
//         <div className={styles.nav}>
//           <NavigationBar />
//           <Suspense
//             fallback={<div aria-busy="true" style={{ display: "none" }} />}
//           >
//             <Routes>
//               <Route path="/" element={<LandingPage />} />
//               <Route path="/explore" element={<ExplorePage />} />
//               <Route path="/create" element={<InstagramCreatePost />} />
//             </Routes>
//           </Suspense>
//           <QuickAccess />
//         </div>
//       </BrowserRouter>
//     </div>
//   );
// };

// export default App;

// Main App component
// const App: React.FC = () => {
//   useEffect(() => {
//     requestNotificationPermission();
//     onFirebaseMessage();
//   }, []);

//   const location = useLocation();

//   // // Check if current route is signin
//   const isSignin = location.pathname === "/signin";

//   return (
//     <AuthProvider>
//       <div className={styles.main}>
//         <BrowserRouter>
//           <div className={styles.nav}>
//             {/* {!isSignin && <NavigationBar />} */}
//             <NavigationBar />
//             <Suspense
//               fallback={<div aria-busy="true" style={{ display: "none" }} />}
//             >
//               <Routes>
//                 <Route
//                   path="/"
//                   element={
//                     
//                       <LandingPage />
//                     
//                   }
//                 />
//                 <Route
//                   path="/explore"
//                   element={
//                     
//                       <ExplorePage />
//                     
//                   }
//                 />
//                 <Route
//                   path="/create"
//                   element={
//                     
//                       <InstagramCreatePost />
//                     
//                   }
//                 />
//                 <Route
//                   path="/admin"
//                   element={
//                     
//                       <AdminPage />
//                     
//                   }
//                 />
//                 <Route path="/signin" element={<Signin />} />
//                 <Route
//                   path="/dashboard"
//                   element={
//                     
//                       <Dashboard />
//                     
//                   }
//                 />
//                 {/* Redirect any unmatched routes to signin or landing based on auth state */}
//                 <Route
//                   path="*"
//                   element={
//                     
//                       <Navigate to="/" replace />
//                     
//                   }
//                 />
//               </Routes>
//             </Suspense>
//             {/* {!isSignin && <QuickAccess />} */}
//             <QuickAccess />
//           </div>
//           {/* <RouteChangeHandler children={undefined} /> */}
//         </BrowserRouter>
//       </div>
//     </AuthProvider>
//   );
// };

// export default App;

const AppContent: React.FC = () => {
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
              
                <LandingPage />
                
            }
          />
          <Route
            path="/explore"
            element={
              
                <ExplorePage />
                
            }
          />
          <Route
            path="/create"
            element={
              
                <InstagramCreatePost />
                
            }
          />
          <Route
            path="/admin"
            element={
              
                <AdminPage />
                
            }
          />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/dashboard"
            element={
              
                <Dashboard />
                
            }
          />
        </Routes>
      </Suspense>
      {!isSignin && <QuickAccess />}
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
