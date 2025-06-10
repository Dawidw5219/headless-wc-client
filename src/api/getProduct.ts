import { HWCProductDetailed } from "../types/ProductDetailed";
import { betterFetch, getBetterFetchOptions } from "../utils/fetchWithRetry";

export async function getProduct(
  url: string,
  idOrSlug: number | string
): Promise<HWCProductDetailed> {
  try {
    const res = await betterFetch(
      `${url}/wp-json/headless-wc/v1/products/${idOrSlug}`,
      getBetterFetchOptions()
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json["success"] != true) throw new Error();
    return json.data as HWCProductDetailed;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
