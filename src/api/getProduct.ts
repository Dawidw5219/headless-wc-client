import { HWCProductDetailed } from "../types/ProductDetailed";

export async function getProduct(url: string, idOrSlug: number | string): Promise<HWCProductDetailed> {
  try {
    const isDevEnv = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
    const res = await fetch(`${url}/wp-json/headless-wc/v1/products/${idOrSlug}`, {
      cache: isDevEnv ? "no-store" : "default",
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json["success"] != true) throw new Error();
    return json.data as HWCProductDetailed;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
