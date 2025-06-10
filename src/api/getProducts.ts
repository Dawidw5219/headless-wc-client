import { HWCProduct } from "../types/Product";
import { betterFetch, getBetterFetchOptions } from "../utils/fetchWithRetry";

export async function getProducts(url: string): Promise<HWCProduct[]> {
  try {
    const res = await betterFetch(
      `${url}/wp-json/headless-wc/v1/products`,
      getBetterFetchOptions()
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json["success"] != true) throw new Error();
    return json.data as HWCProduct[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
