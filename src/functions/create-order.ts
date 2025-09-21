import { createOrder as apiCreateOrder } from "../api/woocommerce";
import type { HWCCustomerData } from "../types/customer-data";
import type { HWCOrder } from "../types/order";
import type { HWCResp } from "../types/response";
import { getBaseUrl } from "./config";

export async function createOrder(args: {
  cartItems: (
    | { id: number; quantity: number }
    | { slug: string; quantity: number }
  )[];
  couponCode?: string;
  billingData: HWCCustomerData;
  shippingData?: HWCCustomerData;
  shippingMethodId?: string;
  paymentMethodId?: string;
  redirectURL?: string;
  customFields?: { [key: string]: any };
}): Promise<HWCOrder> {
  const url = getBaseUrl();
  const res = (await apiCreateOrder(url, args)) as HWCResp<HWCOrder>;
  if ((res as any).success === false) {
    throw new Error((res as any).message);
  }
  return (res as any).data as HWCOrder;
}
