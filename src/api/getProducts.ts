import { HWCProduct } from "../types/Product";
import { ResponseError } from "../types/ResponseError";
import { betterFetch } from "../utils/betterFetch";

export async function getProducts(
  url: string
): Promise<HWCProduct[] | ResponseError> {
  try {
    const res = await betterFetch(`${url}/wp-json/headless-wc/v1/products`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json.success === false) {
      return json as ResponseError;
    }
    return json as HWCProduct[];
  } catch (error) {
    return {
      success: false,
      message: "Network or HTTP error occurred",
      error: "internal",
    };
  }
}
