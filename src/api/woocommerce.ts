import type { HWCCart } from "../types/cart";
import type { HWCCustomerData } from "../types/customer-data";
import type { HWCOrder } from "../types/order";
import type { HWCOrderDetails } from "../types/order-details";
import type { HWCProduct } from "../types/product";
import type { HWCProductDetailed } from "../types/product-detailed";
import type { HWCProductQuery } from "../types/product-query";
import type { HWCError, HWCResp } from "../types/response";
import type { HWCCreateUserRequest, HWCCreateUserResult } from "../types/user";
import { betterFetch } from "../utils/better-fetch";

export async function createCart(
  url: string,
  products: (
    | { id: number; quantity: number }
    | { slug: string; quantity: number }
  )[],
  couponCode: string = "",
  customFields?: { [key: string]: any }
): Promise<HWCResp<HWCCart>> {
  const res = await betterFetch(`${url}/wp-json/headless-wc/v1/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-cache",
    body: JSON.stringify({ cart: products, couponCode, customFields }),
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  if (json.success === false) return json as HWCError;
  return { success: true, data: json as HWCCart };
}

export async function createOrder(
  url: string,
  props: {
    cartItems: (
      | { id: number; quantity: number }
      | { slug: string; quantity: number }
    )[];
    couponCode?: string;
    billing: HWCCustomerData;
    shipping?: HWCCustomerData;
    shippingMethodId?: string;
    paymentMethodId?: string;
    redirectURL?: string;
    meta?: { [key: string]: any };
  }
): Promise<HWCResp<HWCOrder>> {
  const res = await betterFetch(`${url}/wp-json/headless-wc/v1/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      (() => {
        const payload: any = {
          cart: props.cartItems,
          couponCode: props.couponCode ?? "",
          shippingMethodId: props.shippingMethodId,
          paymentMethodId: props.paymentMethodId,
          redirectUrl: props.redirectURL ?? "",
          useDifferentShipping: Boolean(props.shipping),
          billing: props.billing,
          meta: props.meta,
        };
        if (props.shipping) payload.shipping = props.shipping;
        return payload;
      })()
    ),
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  if (json.success === false) return json as HWCError;
  return { success: true, data: json as HWCOrder };
}

export async function getOrderDetails(
  url: string,
  orderId: number,
  orderKey: string
): Promise<HWCResp<HWCOrderDetails>> {
  const res = await betterFetch(
    `${url}/wp-json/headless-wc/v1/order/${orderId}?key=${encodeURIComponent(
      orderKey
    )}`
  );
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  if (json.success === false) return json as HWCError;
  return { success: true, data: json as HWCOrderDetails };
}

export async function getProduct(
  url: string,
  idOrSlug: number | string
): Promise<HWCResp<HWCProductDetailed>> {
  const res = await betterFetch(
    `${url}/wp-json/headless-wc/v1/products/${idOrSlug}`
  );
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  if (json.success === false) return json as HWCError;
  return { success: true, data: json as HWCProductDetailed };
}

function buildProductsUrl(url: string, params?: HWCProductQuery): string {
  const base = `${url}/wp-json/headless-wc/v1/products`;
  if (!params) return base;
  const qs = new URLSearchParams();
  const pairs: Array<[string, string | undefined]> = [
    ["search", params.search],
    ["category", params.category],
    ["page", params.page !== undefined ? String(params.page) : undefined],
    [
      "perPage",
      params.perPage !== undefined ? String(params.perPage) : undefined,
    ],
    ["sort", params.sort],
    ["order", params.order],
  ];
  for (const [k, v] of pairs) {
    if (v !== undefined) qs.set(k, v);
  }
  const s = qs.toString();
  return s ? `${base}?${s}` : base;
}

export async function getProducts(
  url: string,
  params?: HWCProductQuery
): Promise<HWCResp<HWCProduct[]>> {
  const res = await betterFetch(buildProductsUrl(url, params));
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = (await res.json()) as
    | (HWCError & { data?: unknown })
    | { success: true; data: unknown };
  if ((json as any).success === false) return json as HWCError;
  const items = Array.isArray((json as any).data)
    ? ((json as any).data as HWCProduct[])
    : [];
  return { success: true, data: items };
}

export async function createUser(
  url: string,
  userData: HWCCreateUserRequest
): Promise<HWCResp<HWCCreateUserResult>> {
  const res = await betterFetch(`${url}/wp-json/headless-wc/v1/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      (() => {
        const payload: any = { ...userData };
        if (!userData.shipping) delete payload.shipping;
        return payload;
      })()
    ),
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  if (json.success === false) return json as HWCError;
  return { success: true, data: json as HWCCreateUserResult };
}
