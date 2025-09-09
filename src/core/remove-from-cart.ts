import { createCart as apiCreateCart } from "../api/woocommerce";
import type { HWCCart } from "../types/cart";
import type { HWCResp } from "../types/response";
import type { HWCCartItemInput } from "./cart-item";
import { getBaseUrl } from "./config";

export async function removeFromCart(
  cartItems: HWCCartItemInput[],
  idOrSlug: number | string,
): Promise<HWCCart> {
  const url = getBaseUrl();
  const next = cartItems.filter((item) => {
    if (typeof idOrSlug === "number") {
      return !("id" in item && item.id === idOrSlug);
    }
    return !("slug" in item && item.slug === idOrSlug);
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
