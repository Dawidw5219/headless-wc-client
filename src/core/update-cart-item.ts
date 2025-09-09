import { createCart as apiCreateCart } from "../api/woocommerce";
import type { HWCCart } from "../types/cart";
import type { HWCResp } from "../types/response";
import type { HWCCartItemInput } from "./cart-item";
import { getBaseUrl } from "./config";

export async function updateCartItem(
  cartItems: HWCCartItemInput[],
  change: { id?: number; slug?: string; quantity: number },
): Promise<HWCCart> {
  const url = getBaseUrl();
  const next = cartItems.map((item) => {
    if ("id" in item && change.id !== undefined && item.id === change.id) {
      return { id: item.id, quantity: change.quantity } as HWCCartItemInput;
    }
    if (
      "slug" in item &&
      change.slug !== undefined &&
      item.slug === change.slug
    ) {
      return { slug: item.slug, quantity: change.quantity } as HWCCartItemInput;
    }
    return item;
  });
  const res = (await apiCreateCart(
    url,
    next as any,
    "",
    undefined as unknown as Record<string, unknown> | undefined,
  )) as HWCResp<HWCCart>;
  if ((res as any).success === false) throw new Error((res as any).message);
  return (res as any).data as HWCCart;
}
