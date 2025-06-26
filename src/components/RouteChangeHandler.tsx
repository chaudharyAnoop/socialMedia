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
    setIsLoading(true);
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    return () => {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    };
  }, [location.pathname]);

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
      <Suspense fallback={<div aria-busy="true" style={{ display: "none" }} />}>
        <div
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={handleSuspenseComplete}
        >
          {children}
        </div>
      </Suspense>
    </>
  );
};

export default RouteChangeHandler;
