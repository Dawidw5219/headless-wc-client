export interface FetchWithRetryOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

/**
 * Enhanced fetch function with retry mechanism
 * @param url - The URL to fetch
 * @param options - Fetch options with optional retry configuration
 * @returns Promise<Response>
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const { retries = 3, retryDelay = 500, ...fetchOptions } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);

      // Return response if successful or if it's the last attempt
      if (response.ok || attempt === retries) {
        return response;
      }

      // If not successful and not the last attempt, treat as error to trigger retry
      lastError = new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If it's the last attempt, throw the error
      if (attempt === retries) {
        throw lastError;
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
 * @returns FetchWithRetryOptions with cache settings
 */
export function getRetryFetchOptions(
  customOptions: FetchWithRetryOptions = {}
): FetchWithRetryOptions {
  const isDevEnv =
    process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

  return {
    cache: isDevEnv ? "no-store" : "default",
    retries: 3,
    retryDelay: 500,
    ...customOptions,
  };
}
