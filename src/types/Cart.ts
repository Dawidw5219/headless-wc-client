import type { HWCCartItem } from "./cart-product";
import type { HWCPaymentMethod } from "./payment-method";
import type { HWCShippingMethod } from "./shipping-method";

export type HWCCart = {
  products: HWCCartItem[];
  total: number;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  shippingTotal: number;
  couponCode: string;
  currency: string;
  shippingMethods: HWCShippingMethod[];
  paymentMethods: HWCPaymentMethod[];
  customFields?: Record<string, unknown>;
};
