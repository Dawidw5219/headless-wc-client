import { HWCCartProduct } from "../types/CartProduct";
import { HWCPaymentMethod } from "../types/PaymentMethod";
import { HWCShippingMethod } from "../types/ShippingMethod";

export async function createCart(
  url: string,
  products: { id: number; quantity: number }[],
  couponCode: string = ""
): Promise<ServerRes> {
  try {
    const res = await fetch(`${url}/wp-json/headless-wc/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({ cart: products, couponCode }),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json["success"] != true) throw new Error();
    return json as ServerRes;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

type ServerRes = {
  products: HWCCartProduct[];
  subtotal: number;
  total: number;
  tax_total: number;
  discount_total: number;
  shipping_total: number;
  coupon_code: string;
  currency: string;
  shipping_methods: HWCShippingMethod[];
  payment_methods: HWCPaymentMethod[];
};
