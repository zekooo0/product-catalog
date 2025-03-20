import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class values into a single string using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Custom error class for API errors with status code
 */
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Enhanced fetcher function for SWR with better error handling
 */
export const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      const error = new ApiError(
        errorText || `Failed with status: ${res.status}`,
        res.status
      );
      throw error;
    }
    
    return res.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    
    // Handle fetch errors (network issues, etc.)
    const networkError = new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
    throw networkError;
  }
};

/**
 * Formats a price value with currency symbol
 */
export const formatPrice = (price: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

/**
 * Truncates text to a specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Safely parse JSON with error handling
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    return fallback;
  }
};
