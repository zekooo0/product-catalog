/**
 * Environment variable validation
 * This utility helps validate required environment variables and logs warnings
 * when required variables are missing.
 */

interface EnvVarConfig {
  name: string;
  required: boolean;
  allowEmptyString?: boolean;
  defaultValue?: string;
}

/**
 * List of environment variables used in the application
 */
const ENV_VARS: EnvVarConfig[] = [
  { name: 'NEXT_PUBLIC_API_URL', required: true },
  { name: 'NEXT_PUBLIC_FEATURE_NEW_UI', required: false, defaultValue: 'false' },
];

/**
 * Validate all environment variables
 * @returns Array of missing required environment variables
 */
export function validateEnv(): string[] {
  const missing: string[] = [];

  ENV_VARS.forEach((envVar) => {
    const value = process.env[envVar.name];
    
    // Check if variable is missing or empty (when not allowed)
    const isMissing = value === undefined || 
      (!envVar.allowEmptyString && value === '');
    
    if (envVar.required && isMissing) {
      missing.push(envVar.name);
    }
    
    // Set default value if specified and variable is missing
    if (isMissing && envVar.defaultValue !== undefined) {
      process.env[envVar.name] = envVar.defaultValue;
    }
  });

  // Log warning in development
  if (missing.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn(
      `⚠️  Missing required environment variables: ${missing.join(', ')}`
    );
    console.warn('Check .env.local.example for the required variables');
  }

  return missing;
}

// Run validation immediately in development
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  validateEnv();
}

/**
 * Get a validated environment variable
 * @param name The name of the environment variable
 * @param defaultValue Default value if not set
 * @returns The value of the environment variable or default
 */
export function getEnv(name: string, defaultValue: string = ''): string {
  return process.env[name] || defaultValue;
} 