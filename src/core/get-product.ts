import { getProduct as apiGetProduct } from "../api/woocommerce";
import type { HWCProductDetailed } from "../types/product-detailed";
import type { HWCResp } from "../types/response";
import { getBaseUrl } from "./config";

export async function getProduct(
  idOrSlug: number | string,
): Promise<HWCProductDetailed> {
  const url = getBaseUrl();
  const res = (await apiGetProduct(
    url,
    idOrSlug,
  )) as HWCResp<HWCProductDetailed>;
  if ((res as any).success === false) {
    throw new Error((res as any).message);
  }
  return (res as any).data as HWCProductDetailed;
}
