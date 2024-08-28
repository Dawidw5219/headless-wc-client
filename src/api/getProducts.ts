import { HWCProductDetailed } from "../types/Product";

export async function getProducts(url: string): Promise<HWCProductDetailed[]> {
  try {
    const response = await fetch(`${url}/wp-json/headless-wc/v1/products`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data["success"] != true) throw new Error();
    return data.products as HWCProductDetailed[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
