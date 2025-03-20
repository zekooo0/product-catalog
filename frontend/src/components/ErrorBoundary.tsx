"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { ErrorService } from "@/lib/error-service";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: "",
  };

  public static getDerivedStateFromError(error: Error): State {
    // Get a user-friendly error message
    const errorMessage = ErrorService.getUserFriendlyMessage(error);
    
    return { 
      hasError: true, 
      error,
      errorMessage
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to our error service
    ErrorService.logError(error, { 
      componentStack: errorInfo.componentStack,
      info: "Caught in ErrorBoundary"
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[400px] w-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Something went wrong</h2>
              <p className="mt-2 text-muted-foreground">
                {this.state.errorMessage || this.state.error?.message}
              </p>
              <button
                className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
                onClick={() => this.setState({ hasError: false })}
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
