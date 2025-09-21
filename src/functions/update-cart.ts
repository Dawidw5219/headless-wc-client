import { createCart as apiCreateCart } from "../api/woocommerce";
import type { HWCCart } from "../types/cart";
import type { HWCResp } from "../types/response";
import type { HWCCartItemInput } from "./cart-item";
import { getBaseUrl } from "./config";

export async function updateCart(
  cartItems: HWCCartItemInput[],
  changes: (
    | { id: number; quantity: number }
    | { slug: string; quantity: number }
  )[],
): Promise<HWCCart> {
  const url = getBaseUrl();
  const byId = new Map<number, number>();
  const bySlug = new Map<string, number>();
  for (const c of changes) {
    if ("id" in c) byId.set(c.id, c.quantity);
    else bySlug.set(c.slug, c.quantity);
  }
  const next = cartItems.map((item) => {
    if ("id" in item) {
      const q = byId.get(item.id) ?? item.quantity;
      return { id: item.id, quantity: q } as HWCCartItemInput;
    }
    const q = bySlug.get(item.slug) ?? item.quantity;
    return { slug: item.slug, quantity: q } as HWCCartItemInput;
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
