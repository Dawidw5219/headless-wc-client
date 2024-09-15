import { HWCCustomerData } from "../types/CustomerData";
import { HWCOrder } from "../types/Order";

export async function createOrder(props: {
  billingData: HWCCustomerData;
  shippingData?: HWCCustomerData;
  shippingMethodId: string;
  paymentMethodId: string;
  redirectURL?: string;
  furgonetkaPoint?: string;
  furgonetkaPointName?: string;
}): Promise<HWCOrder> {
  try {
    const res = await fetch(`${this.url}/wp-json/headless-wc/v1/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({
        cart: this.cartItems,
        coupon_code: this.coupon_code,
        // total: this.total,
        shipping_method_id: props.shippingMethodId,
        payment_method_id: props.paymentMethodId,
        redirect_url: props.redirectURL ?? "",
        use_different_shipping: false,
        billing_first_name: props.billingData.firstName,
        billing_last_name: props.billingData.lastName,
        billing_address_1: props.billingData.address1,
        billing_address_2: props.billingData.address2 ?? "",
        billing_city: props.billingData.city,
        billing_state: props.billingData.state,
        billing_postcode: props.billingData.postcode,
        billing_country: props.billingData.country,
        billing_phone: props.billingData.phone,
        billing_email: props.billingData.email,
        furgonetkaPoint: props.furgonetkaPoint,
        furgonetkaPointName: props.furgonetkaPointName,
      }),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json["success"] != true) throw new Error();
    return json as HWCOrder;
  } catch (error) {
    throw new Error("Invalid response from WooCommerce Server. Couldn't create an order");
  }
}
