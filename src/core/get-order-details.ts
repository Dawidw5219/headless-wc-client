import { getOrderDetails as apiGetOrderDetails } from "../api/woocommerce";
import type { HWCOrderDetails } from "../types/order-details";
import type { HWCResp } from "../types/response";
import { getBaseUrl } from "./config";

export async function getOrderDetails(
  orderId: number,
  orderKey: string,
): Promise<HWCOrderDetails> {
  const url = getBaseUrl();
  const res = (await apiGetOrderDetails(
    url,
    orderId,
    orderKey,
  )) as HWCResp<HWCOrderDetails>;
  if ((res as any).success === false) {
    throw new Error((res as any).message);
  }
  return (res as any).data as HWCOrderDetails;
}
