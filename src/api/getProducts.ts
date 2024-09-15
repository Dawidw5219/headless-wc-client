import { HWCProduct } from "../types/Product";

export async function getProducts(url: string): Promise<HWCProduct[]> {
  try {
    const isDevEnv = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
    const res = await fetch(`${url}/wp-json/headless-wc/v1/products`, {
      cache: isDevEnv ? "no-store" : "default",
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json["success"] != true) throw new Error();
    return json.data as HWCProduct[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
