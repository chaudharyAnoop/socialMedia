import { Component, type ReactNode } from "react";
import styles from "../styles/ErrorBoundary.module.css";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1 className={styles.main}>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
