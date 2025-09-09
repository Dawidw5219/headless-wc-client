import { createCart as apiCreateCart } from "../api/woocommerce";
import type { HWCCart } from "../types/cart";
import type { HWCResp } from "../types/response";
import { getBaseUrl } from "./config";
export type HWCCartItemInput = { id: number; quantity: number };

export async function revalidateCart(
  cartItems: HWCCartItemInput[],
): Promise<HWCCart> {
  const url = getBaseUrl();
  const res = (await apiCreateCart(
    url,
    cartItems as any,
    "",
    undefined as unknown as Record<string, unknown> | undefined,
  )) as HWCResp<HWCCart>;
  if ((res as any).success === false) throw new Error((res as any).message);
  return (res as any).data as HWCCart;
}
