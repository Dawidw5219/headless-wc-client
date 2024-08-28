import { HWCProductBasic } from "./Product";
import { HWCPaymentMethod } from "./PaymentMethod";
import { HWCShippingMethod } from "./ShippingMethod";

export interface HWCCartResponse {
  products: HWCProductBasic[];
  subtotal: number;
  total: number;
  taxTotal: number;
  discountTotal: number;
  shippingTotal: number;
  couponCode: string;
  currency: string;
  availableShippingMethods: HWCShippingMethod[];
  availablePaymentMethods: HWCPaymentMethod[];
}
