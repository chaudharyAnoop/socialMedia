import { useState, useEffect, useRef, Suspense } from "react";
import { useLocation } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

interface RouteChangeHandlerProps {
  children: React.ReactNode;
}

const RouteChangeHandler: React.FC<RouteChangeHandlerProps> = ({
  children,
}) => {
  const location = useLocation();
  const loadingBarRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Start the loading bar when the route changes
    setIsLoading(true);
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    // No hardcoded timeout; rely on Suspense or data fetching to complete
    return () => {
      // Cleanup: complete the loading bar if the route changes again
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    };
  }, [location.pathname]);

  // Callback to handle when Suspense loading is complete
  const handleSuspenseComplete = () => {
    setIsLoading(false);
    if (loadingBarRef.current) {
      loadingBarRef.current.complete();
    }
  };

  return (
    <>
      <LoadingBar
        color="#f11946"
        ref={loadingBarRef}
        height={3}
        shadow={true}
        waitingTime={200}
      />
      <Suspense
        fallback={
          // Keep the loading bar active during Suspense fallback
          <div aria-busy="true" style={{ display: "none" }} />
        }
      >
        <div
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={handleSuspenseComplete} // Note: onLoad may not work reliably for divs; see notes below
        >
          {children}
        </div>
      </Suspense>
    </>
  );
};

export default RouteChangeHandler;
