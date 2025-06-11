// import { useState } from "react";
import styles from "./App.module.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar/NavigationBar";
// import LandingPage from "./pages/LandingPage/LandingPage";
import QuickAccess from "./components/QuickAccess/QuickAccess";
import Signin from "./pages/Signin/Signin";
function App() {
  // const [count, setCount] = useState(0);

  return (
      <div className={styles.main}>
          <BrowserRouter>
              <div className={styles.nav}>
                  <NavigationBar />
                  <Routes>
                      {/* <Route path="/" element={<LandingPage />} /> */}
                      <Route path="/" element={<Signin/>} />
                  </Routes>
                  <QuickAccess />
              </div>
          </BrowserRouter>
      </div>
  );
}

export default App;
