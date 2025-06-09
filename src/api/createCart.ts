import { HWCCartType } from "../types/Cart";
import { fetchWithRetry, getRetryFetchOptions } from "../utils/fetchWithRetry";

export async function createCart(
  url: string,
  products: (
    | { id: number; quantity: number }
    | { slug: string; quantity: number }
  )[],
  couponCode: string = "",
  customFields?: { [key: string]: any }
): Promise<HWCCartType> {
  try {
    const res = await fetchWithRetry(
      `${url}/wp-json/headless-wc/v1/cart`,
      getRetryFetchOptions({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
        body: JSON.stringify({ cart: products, couponCode, customFields }),
      })
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json["success"] != true) throw new Error();
    return json as HWCCartType;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
