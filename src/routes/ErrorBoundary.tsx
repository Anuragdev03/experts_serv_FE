import React, { ErrorInfo, ReactNode } from "react";
import { Link } from "react-router";
import "./Style.css"
// Define props and state types
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state to display fallback UI on error
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an external service here
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h1>Oops! Something went wrong.</h1>
          <p>We're sorry, but an unexpected error has occurred.</p>
          <p>Please try refreshing the page or returning to the <Link to="/">homepage</Link>.</p>
        </div>
      )
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
