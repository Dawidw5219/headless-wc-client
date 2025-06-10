import { HWCProduct } from "../types/Product";
import { ApiResp, ErrorResp } from "../types/Response";
import { betterFetch } from "../utils/betterFetch";

export async function getProducts(url: string): Promise<ApiResp<HWCProduct[]>> {
  try {
    const res = await betterFetch(`${url}/wp-json/headless-wc/v1/products`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json.success === false) {
      return json as ErrorResp;
    }
    return { success: true, data: json as HWCProduct[] };
  } catch (error) {
    return {
      success: false,
      message: "Network or HTTP error occurred",
      error: "internal",
    };
  }
}
