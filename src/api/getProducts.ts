import { HWCProductType } from "../types/Product";

export async function getProducts(url: string): Promise<HWCProductType[]> {
  try {
    const response = await fetch(`${url}/wp-json/headless-wc/v1/products`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data["success"] != true) throw new Error();
    return data.data as HWCProductType[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
