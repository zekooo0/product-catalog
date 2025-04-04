import { ApiError } from './utils';

/**
 * Error levels for categorizing errors
 */
export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Common error types for better organization
 */
export enum ErrorType {
  API = 'api_error',
  AUTH = 'auth_error',
  VALIDATION = 'validation_error',
  NETWORK = 'network_error',
  UNKNOWN = 'unknown_error',
}

interface ErrorDetails {
  message: string;
  type: ErrorType;
  level: ErrorLevel;
  metadata: Record<string, unknown>;
}

/**
 * Central error handling service
 */
export const ErrorService = {
  /**
   * Log an error with metadata
   */
  logError: (error: Error | ApiError | unknown, metadata: Record<string, unknown> = {}) => {
    // Extract error details
    const errorDetails: ErrorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      type: getErrorType(error),
      level: getErrorLevel(error),
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        stack: error instanceof Error ? error.stack : undefined,
      },
    };

    // Add API status if available
    if (error instanceof ApiError) {
      errorDetails.metadata.status = error.status;
    }

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', errorDetails);
    }

    // In production, you could send this to an error tracking service
    // like Sentry, LogRocket, etc.
    // if (process.env.NODE_ENV === 'production') {
    //   // Send to error tracking service
    // }

    return errorDetails;
  },

  /**
   * Format user-friendly error message
   */
  getUserFriendlyMessage: (error: Error | ApiError | unknown): string => {
    if (error instanceof ApiError) {
      // Handle API errors based on status code
      switch (error.status) {
        case 401:
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
        case 502:
        case 503:
        case 504:
          return 'Our servers are experiencing issues. Please try again later.';
        default:
          return error.message || 'An unexpected error occurred.';
      }
    }

    // Generic network errors
    if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network'))) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }

    // Default fallback message
    return 'Something went wrong. Please try again later.';
  },
};

/**
 * Determine error type based on error properties
 */
function getErrorType(error: unknown): ErrorType {
  if (error instanceof ApiError) {
    return ErrorType.API;
  }

  if (error instanceof Error) {
    const errorMsg = error.message.toLowerCase();
    const errorName = error.name.toLowerCase();
    
    if (errorMsg.includes('auth') || errorMsg.includes('login') || errorName.includes('auth')) {
      return ErrorType.AUTH;
    }

    if (errorMsg.includes('validation') || errorName.includes('validation')) {
      return ErrorType.VALIDATION;
    }

    if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorName.includes('network')) {
      return ErrorType.NETWORK;
    }
  }

  return ErrorType.UNKNOWN;
}

/**
 * Determine error severity level based on error properties
 */
function getErrorLevel(error: unknown): ErrorLevel {
  if (error instanceof ApiError) {
    if (error.status >= 500) {
      return ErrorLevel.CRITICAL;
    }
    if (error.status >= 400) {
      return ErrorLevel.ERROR;
    }
    return ErrorLevel.WARNING;
  }

  // Authentication errors are important
  if (getErrorType(error) === ErrorType.AUTH) {
    return ErrorLevel.ERROR;
  }

  // Default to ERROR level
  return ErrorLevel.ERROR;
} 