import { getProducts as apiGetProducts } from "../api/woocommerce";
import type { HWCProduct } from "../types/product";
import type { HWCProductQuery } from "../types/product-query";
import type { HWCResp } from "../types/response";
import { getBaseUrl } from "./config";

export async function getProducts(
  params?: HWCProductQuery,
): Promise<HWCProduct[]> {
  const url = getBaseUrl();
  const res = (await apiGetProducts(url, params)) as HWCResp<HWCProduct[]>;
  if ((res as any).success === false) {
    throw new Error((res as any).message);
  }
  return (res as any).data as HWCProduct[];
}
