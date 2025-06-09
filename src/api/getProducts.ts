import { HWCProduct } from "../types/Product";
import { fetchWithRetry, getRetryFetchOptions } from "../utils/fetchWithRetry";

export async function getProducts(url: string): Promise<HWCProduct[]> {
  try {
    const res = await fetchWithRetry(
      `${url}/wp-json/headless-wc/v1/products`,
      getRetryFetchOptions()
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
