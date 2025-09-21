import { createCart as apiCreateCart } from "../api/woocommerce";
import type { HWCCart } from "../types/cart";
import type { HWCResp } from "../types/response";
import type { HWCCartItemInput } from "./cart-item";
import { getBaseUrl } from "./config";

export async function addToCart(
  cartItems: HWCCartItemInput[],
  input:
    | { id: number; quantity?: number }
    | { slug: string; quantity?: number },
): Promise<HWCCart> {
  const url = getBaseUrl();
  const item =
    "id" in input
      ? { id: input.id, quantity: input.quantity ?? 1 }
      : { slug: input.slug, quantity: input.quantity ?? 1 };
  const res = (await apiCreateCart(
    url,
    [...cartItems, item] as any,
    "",
    undefined as unknown as Record<string, unknown> | undefined,
  )) as HWCResp<HWCCart>;
  if ((res as any).success === false) {
    throw new Error((res as any).message);
  }
  return (res as any).data as HWCCart;
}
