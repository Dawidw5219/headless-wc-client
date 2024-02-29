import { HWCProduct } from "./HWCProduct";
import { HWCPaymentMethod } from "./HWCPaymentMethod";
import { HWCShippingMethod } from "./HWCShippingMethod";

export interface HWCCartResponse {
  products: HWCProduct[];
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
