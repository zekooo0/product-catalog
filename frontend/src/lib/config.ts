/**
 * Application configuration
 * Centralizes all environment variables and configuration settings
 */
import { getEnv } from './env-validator';

// API Configuration
export const API_BASE_URL =
  'https://product-catalog-omega-olive.vercel.app/api';

// Feature Flags
export const FEATURES = {
  NEW_UI: getEnv('NEXT_PUBLIC_FEATURE_NEW_UI', 'false') === 'true',
};

// Application settings
export const APP_CONFIG = {
  APP_NAME: 'Product Catalog',
  APP_DESCRIPTION: 'Manage your product catalog efficiently',
  DEFAULT_PAGE_SIZE: 20,
};

// export const API_BASE_URL = "http://localhost:5000/api";
