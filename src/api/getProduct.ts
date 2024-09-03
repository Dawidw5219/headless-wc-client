import { HWCProduct } from "../classes/Product";

export async function getProduct(url: string, idOrSlug: number | string): Promise<HWCProduct> {
  try {
    const response = await fetch(`${url}/wp-json/headless-wc/v1/products/${idOrSlug}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data["success"] != true) throw new Error();
    return new HWCProduct(data.data);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
