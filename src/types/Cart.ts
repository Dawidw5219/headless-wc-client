import { HWCCartProduct } from "./CartProduct";
import { HWCPaymentMethod } from "./PaymentMethod";
import { HWCShippingMethod } from "./ShippingMethod";

// Typ lub interfejs definiujący strukturę danych dla koszyka
export type HWCCartType = {
  products: HWCCartProduct[];
  total: number;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  shippingTotal: number;
  couponCode: string;
  currency: string;
  shippingMethods: HWCShippingMethod[];
  paymentMethods: HWCPaymentMethod[];
  customFields?: { [key: string]: any };
};
