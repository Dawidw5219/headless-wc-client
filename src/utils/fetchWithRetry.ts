export interface BetterFetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

/**
 * Check if we're in development environment
 */
function isDevEnvironment(): boolean {
  return process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
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

      const errorDetails = {
        url,
        method: fetchOptions.method || "GET",
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        responseBody: responseJson || responseText,
        attempt,
        maxRetries: retries,
      };

      // Log detailed error info in dev environment
      if (isDev) {
        console.error("🚨 HTTP Request Failed:", errorDetails);
      }

      // Create error with basic info
      lastError = new Error(`HTTP error! status: ${response.status}`);

      // If it's the last attempt, return the response (let the caller handle the error)
      if (attempt === retries) {
        return response;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Log network/fetch errors in dev environment
      if (isDev) {
        console.error("🚨 Network/Fetch Error:", {
          url,
          method: fetchOptions.method || "GET",
          error: lastError.message,
          attempt,
          maxRetries: retries,
        });
      }

      // If it's the last attempt, throw the error
      if (attempt === retries) {
        throw lastError;
      }
    }

    // Wait before retrying (except on the last attempt)
    if (attempt < retries) {
      if (isDev) {
        console.warn(
          `⏳ Retrying request in ${retryDelay}ms... (attempt ${
            attempt + 1
          }/${retries})`
        );
      }
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
    retryDelay: 500,
    ...customOptions,
  };
}

// Legacy exports for backward compatibility (will be removed in future versions)
export const fetchWithRetry = betterFetch;
export const getRetryFetchOptions = getBetterFetchOptions;
export type FetchWithRetryOptions = BetterFetchOptions;
