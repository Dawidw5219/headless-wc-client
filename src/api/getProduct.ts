import { HWCProductDetailed } from "../types/ProductDetailed";
import { HWCResp, HWCError } from "../types/Response";
import { betterFetch } from "../utils/betterFetch";

export async function getProduct(
  url: string,
  idOrSlug: number | string
): Promise<HWCResp<HWCProductDetailed>> {
  try {
    const res = await betterFetch(
      `${url}/wp-json/headless-wc/v1/products/${idOrSlug}`
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const json = await res.json();

    // Check if API returned error response
    if (json.success === false) {
      return json as HWCError;
    }

    return { success: true, data: json as HWCProductDetailed };
  } catch (error) {
    return {
      success: false,
      message: "Network or HTTP error occurred",
      error: "internal",
    };
  }
}
