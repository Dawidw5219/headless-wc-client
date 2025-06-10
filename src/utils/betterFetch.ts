const APP_NAME = "HeadlessWC";

export interface BetterFetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

/**
 * Check if we're in development environment
 */
function isDevEnvironment(): boolean {
  // Browser environment
  if (typeof window !== "undefined") {
    const hostname = window.location?.hostname;
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname?.includes("localhost") ||
      window.location?.port === "3000"
    );
  }

  // Server environment
  return (
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "development" ||
    !process.env.NODE_ENV
  );
}

/**
 * Enhanced fetch with retry and error debugging
 */
export async function betterFetch(
  url: string,
  options: BetterFetchOptions = {}
): Promise<Response> {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;
  const isDev = isDevEnvironment();

  // Set cache for dev
  if (!fetchOptions.cache) {
    fetchOptions.cache = isDev ? "no-store" : "default";
  }

  let lastError: Error;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);

      if (response.ok) {
        return response;
      }

      // Get response details for debugging
      let responseBody = "[Could not read response]";
      try {
        const clone = response.clone();
        const text = await clone.text();
        responseBody = text ? JSON.parse(text) : text;
      } catch {
        // Keep as text or error message
      }

      lastError = new Error(`HTTP error! status: ${response.status}`);

      // Log final error
      if (attempt === retries && isDev) {
        console.error(`[${APP_NAME}] 🚨 Request failed:`, {
          url,
          method: fetchOptions.method || "GET",
          status: response.status,
          statusText: response.statusText,
          responseBody,
          attempts: retries,
        });
      }

      if (attempt === retries) {
        return response;
      }

      // Log retry warning
      if (isDev) {
        console.warn(
          `[${APP_NAME}] ⏳ HTTP ${response.status} - Retry ${
            attempt + 1
          }/${retries}`
        );
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === retries && isDev) {
        console.error(`[${APP_NAME}] 🚨 Network error:`, {
          url,
          method: fetchOptions.method || "GET",
          error: lastError.message,
          attempts: retries,
        });
      }

      if (attempt === retries) {
        throw lastError;
      }

      if (isDev) {
        console.warn(
          `[${APP_NAME}] ⏳ Network error - Retry ${attempt + 1}/${retries}`
        );
      }
    }

    // Wait before retry
    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  throw lastError!;
}
