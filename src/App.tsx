// import { useState } from "react";
import styles from "./App.module.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar/NavigationBar";
// import LandingPage from "./pages/LandingPage/LandingPage";
import QuickAccess from "./components/QuickAccess/QuickAccess";
// import AdminPage from "./pages/AdminPage/AdminPage";
import { Suspense, lazy } from "react";
import RouteChangeHandler from "./components/RouteChangeHandler";
import ExplorePage from "./pages/explore/ExplorePage";
<<<<<<< HEAD
import Signin from "./pages/Signin/Signin";
=======
>>>>>>> c978f6d377aea881f91c124fc80bcda80449ec8d

const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const AdminPage = lazy(() => import("./pages/AdminPage/AdminPage"));

function App() {
  // const [count, setCount] = useState(0);

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
              <Route path="/signin" element={<Signin />} />
            </Routes>
          </Suspense>
          {/* </RouteChangeHandler> */}
          <QuickAccess />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
