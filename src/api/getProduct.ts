import { HWCProductDetailed } from "../types/Product";

export async function getProduct(url: string, idOrSlug: number | string): Promise<HWCProductDetailed> {
  try {
    const response = await fetch(`${url}/wp-json/headless-wc/v1/products/${idOrSlug}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data["success"] != true) throw new Error();
    return data.product as HWCProductDetailed;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
