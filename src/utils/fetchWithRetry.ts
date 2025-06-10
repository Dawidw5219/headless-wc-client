const APP_NAME = "HeadlessWC";

export interface BetterFetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

/**
 * Check if we're in development environment
 * Supports various environments including Next.js, Vercel, and standard Node.js
 */
function isDevEnvironment(): boolean {
  // Check if we're in browser environment
  if (typeof window !== "undefined") {
    // Browser environment - check for localhost or development indicators
    const hostname = window.location?.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname?.includes("localhost") ||
      hostname?.startsWith("192.168.") ||
      hostname?.startsWith("10.") ||
      hostname?.endsWith(".local");

    // Also check for development port numbers
    const port = window.location?.port;
    const isDevelopmentPort = !!(
      port &&
      (port === "3000" || port === "3001" || port === "5173" || port === "8080")
    );

    return isLocalhost || isDevelopmentPort;
  }

  // Server environment - check process.env variables
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "development" ||
    process.env.VERCEL_ENV === "development" ||
    process.env.ENVIRONMENT === "development" ||
    process.env.APP_ENV === "development" ||
    !process.env.NODE_ENV
  );
}

/**
 * Enhanced fetch function with retry mechanism and detailed error debugging
 * @param url - The URL to fetch
 * @param options - Fetch options with optional retry configuration
 * @returns Promise<Response>
 */
export async function betterFetch(
  url: string,
  options: BetterFetchOptions = {}
): Promise<Response> {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;
  const isDev = isDevEnvironment();

  let lastError: Error;
  let lastResponse: Response | undefined;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);
      lastResponse = response;

      // Return response if successful
      if (response.ok) {
        return response;
      }

      // If not successful, prepare detailed error info for debugging
      let responseText = "";
      let responseJson: any = null;

      try {
        // Clone response to read it without consuming the stream
        const responseClone = response.clone();
        responseText = await responseClone.text();

        // Try to parse as JSON if possible
        if (responseText) {
          try {
            responseJson = JSON.parse(responseText);
          } catch {
            // Not JSON, keep as text
          }
        }
      } catch {
        // Could not read response body
        responseText = "[Could not read response body]";
      }

      // Create error with basic info
      lastError = new Error(`HTTP error! status: ${response.status}`);

      // If it's the last attempt, log comprehensive error details
      if (attempt === retries && isDev) {
        console.error(
          `[${APP_NAME}] 🚨 Request failed after ${retries} attempts:`,
          {
            url,
            method: fetchOptions.method || "GET",
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            responseBody: responseJson || responseText,
            totalAttempts: retries,
          }
        );
      }

      // If it's the last attempt, return the response (let the caller handle the error)
      if (attempt === retries) {
        return response;
      }

      // Log retry info for non-final attempts
      if (isDev && attempt < retries) {
        console.warn(
          `[${APP_NAME}] ⏳ HTTP ${
            response.status
          } - Retrying in ${retryDelay}ms (attempt ${attempt + 1}/${retries})`
        );
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If it's the last attempt, log comprehensive network error
      if (attempt === retries && isDev) {
        console.error(
          `[${APP_NAME}] 🚨 Network error after ${retries} attempts:`,
          {
            url,
            method: fetchOptions.method || "GET",
            error: lastError.message,
            errorType: lastError.constructor.name,
            totalAttempts: retries,
          }
        );
      }

      // If it's the last attempt, throw the error
      if (attempt === retries) {
        throw lastError;
      }

      // Log retry info for non-final attempts
      if (isDev && attempt < retries) {
        console.warn(
          `[${APP_NAME}] ⏳ Network error - Retrying in ${retryDelay}ms (attempt ${
            attempt + 1
          }/${retries})`
        );
      }
    }

    // Wait before retrying (except on the last attempt)
    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  // This should never be reached, but just in case
  throw lastError!;
}

/**
 * Utility function to get default fetch arguments with retry
 * @param customOptions - Additional fetch options
 * @returns BetterFetchOptions with cache settings
 */
export function getBetterFetchOptions(
  customOptions: BetterFetchOptions = {}
): BetterFetchOptions {
  const isDevEnv = isDevEnvironment();

  return {
    cache: isDevEnv ? "no-store" : "default",
    retries: 3,
    retryDelay: 1000,
    ...customOptions,
  };
}

// Legacy exports for backward compatibility (will be removed in future versions)
export const fetchWithRetry = betterFetch;
export const getRetryFetchOptions = getBetterFetchOptions;
export type FetchWithRetryOptions = BetterFetchOptions;
