import { HWCProductDetailed } from "../types/ProductDetailed";
import { fetchWithRetry, getRetryFetchOptions } from "../utils/fetchWithRetry";

export async function getProduct(
  url: string,
  idOrSlug: number | string
): Promise<HWCProductDetailed> {
  try {
    const res = await fetchWithRetry(
      `${url}/wp-json/headless-wc/v1/products/${idOrSlug}`,
      getRetryFetchOptions()
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
