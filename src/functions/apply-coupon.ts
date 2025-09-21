import { createCart as apiCreateCart } from "../api/woocommerce";
import type { HWCCart } from "../types/cart";
import type { HWCResp } from "../types/response";
import type { HWCCartItemInput } from "./cart-item";
import { getBaseUrl } from "./config";

export async function applyCoupon(
  cartItems: HWCCartItemInput[],
  code: string,
): Promise<HWCCart> {
  const url = getBaseUrl();
  const res = (await apiCreateCart(
    url,
    cartItems as any,
    code,
    undefined as unknown as Record<string, unknown> | undefined,
  )) as HWCResp<HWCCart>;
  if ((res as any).success === false) throw new Error((res as any).message);
  return (res as any).data as HWCCart;
}

export async function removeCoupon(
  cartItems: HWCCartItemInput[],
): Promise<HWCCart> {
  return applyCoupon(cartItems, "");
}
