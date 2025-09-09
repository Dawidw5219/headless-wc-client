import { createCart as apiCreateCart } from "../api/woocommerce";
import type { HWCCart } from "../types/cart";
import type { HWCResp } from "../types/response";
import type { HWCCartItemInput } from "./cart-item";
import { getBaseUrl } from "./config";

export async function getCart(cartItems: HWCCartItemInput[]): Promise<HWCCart> {
  const url = getBaseUrl();
  const res = (await apiCreateCart(
    url,
    cartItems,
    "",
    undefined as unknown as Record<string, unknown> | undefined,
  )) as HWCResp<HWCCart>;
  if ((res as any).success === false) {
    throw new Error((res as any).message);
  }
  return (res as any).data as HWCCart;
}

export const createCart = getCart;
