import { HWCCartType } from "../types/Cart";
import { HWCResp, HWCError } from "../types/Response";
import { betterFetch } from "../utils/betterFetch";

export async function createCart(
  url: string,
  products: (
    | { id: number; quantity: number }
    | { slug: string; quantity: number }
  )[],
  couponCode: string = "",
  customFields?: { [key: string]: any }
): Promise<HWCResp<HWCCartType>> {
  try {
    const res = await betterFetch(`${url}/wp-json/headless-wc/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({ cart: products, couponCode, customFields }),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const json = await res.json();

    // Check if API returned error response
    if (json.success === false) {
      return json as HWCError;
    }

    return { success: true, data: json as HWCCartType };
  } catch (error) {
    return {
      success: false,
      message: "Network or HTTP error occurred",
      error: "internal",
    };
  }
}
