let BASE_URL: string | undefined;

export function setWooCommerceUrl(baseUrl: string) {
  BASE_URL = baseUrl;
}

export function getBaseUrl(): string {
  if (BASE_URL) return BASE_URL;
  const fromEnv =
    process.env.WOOCOMMERCE_BASE_URL ||
    process.env.PUBLIC_WOOCOMMERCE_BASE_URL ||
    process.env.NEXT_PUBLIC_WOOCOMMERCE_BASE_URL;
  if (fromEnv) return fromEnv;
  throw new Error(
    "WooCommerce base URL not set. Call setWooCommerceUrl(baseUrl) or provide WOOCOMMERCE_BASE_URL / PUBLIC_WOOCOMMERCE_BASE_URL / NEXT_PUBLIC_WOOCOMMERCE_BASE_URL.",
  );
}
