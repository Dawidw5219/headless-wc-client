const APP_NAME = "HeadlessWC";

export interface BetterFetchOptions extends RequestInit {
  retries?: number;
  retryBaseDelayMs?: number;
  retryMaxDelayMs?: number;
  timeoutMs?: number;
  retryOnStatus?: number[];
}

function isDevEnvironment(): boolean {
  if (typeof window !== "undefined") {
    const hostname = window.location?.hostname;
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname?.includes("localhost") ||
      window.location?.port === "3000"
    );
  }
  return (
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "development" ||
    !process.env.NODE_ENV
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  if (!ms) return promise;
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("Request timeout")), ms);
    promise
      .then((v) => {
        clearTimeout(id);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(id);
        reject(e);
      });
  });
}

function backoffDelay(attempt: number, base: number, max: number): number {
  const exp = base * Math.pow(2, attempt);
  return Math.min(max, exp);
}

function shouldRetry(status: number, allowed: number[]): boolean {
  return allowed.includes(status);
}

async function executeWithRetry(
  attempt: number,
  ctx: {
    retries: number;
    fetcher: () => Promise<Response>;
    onDelay: (ms: number) => void;
    computeDelay: (attempt: number) => number;
    retryOnStatus: number[];
  },
): Promise<Response> {
  const { retries, fetcher, onDelay, computeDelay, retryOnStatus } = ctx;
  try {
    const response = await fetcher();
    if (response.ok) return response;
    if (!shouldRetry(response.status, retryOnStatus) || attempt === retries) {
      return response;
    }
    const delay = computeDelay(attempt);
    onDelay(delay);
    await sleep(delay);
    return executeWithRetry(attempt + 1, ctx);
  } catch (err) {
    if (attempt === retries) throw err;
    const delay = computeDelay(attempt);
    onDelay(delay);
    await sleep(delay);
    return executeWithRetry(attempt + 1, ctx);
  }
}

export async function betterFetch(
  url: string,
  options: BetterFetchOptions = {},
): Promise<Response> {
  const {
    retries = 3,
    retryBaseDelayMs = 300,
    retryMaxDelayMs = 3000,
    timeoutMs = 10000,
    retryOnStatus = [408, 429, 500, 502, 503, 504],
    ...fetchOptions
  } = options;
  const isDev = isDevEnvironment();

  if (!fetchOptions.cache) {
    fetchOptions.cache = isDev ? "no-store" : "default";
  }

  const computeDelay = (attempt: number) =>
    backoffDelay(attempt, retryBaseDelayMs, retryMaxDelayMs);

  const response = await executeWithRetry(0, {
    retries,
    fetcher: () => withTimeout(fetch(url, fetchOptions), timeoutMs),
    onDelay: (ms) => {
      if (isDev) {
        console.error(`[${APP_NAME}] retry in ${ms}ms`);
      }
    },
    computeDelay,
    retryOnStatus,
  });

  return response;
}

export async function betterFetchJson<T>(
  url: string,
  options?: BetterFetchOptions,
): Promise<{ response: Response; json?: T; error?: unknown }> {
  const response = await betterFetch(url, options);
  try {
    const json = (await response.json()) as T;
    return { response, json };
  } catch (error) {
    return { response, error };
  }
}
