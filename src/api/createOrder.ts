import { HWCCustomerData } from "../types/CustomerData";
import { HWCOrder } from "../types/Order";
import { betterFetch, getBetterFetchOptions } from "../utils/fetchWithRetry";

// Typ pozwalający na określanie produktu przez id lub slug
export async function createOrder(
  url: string,
  props: {
    cartItems: (
      | { id: number; quantity: number }
      | { slug: string; quantity: number }
    )[];
    couponCode?: string;
    billingData: HWCCustomerData;
    shippingData?: HWCCustomerData;
    shippingMethodId?: string;
    paymentMethodId?: string;
    redirectURL?: string;
    customFields?: { [key: string]: any };
  }
): Promise<HWCOrder> {
  try {
    const res = await betterFetch(
      `${url}/wp-json/headless-wc/v1/order`,
      getBetterFetchOptions({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: props.cartItems,
          couponCode: props.couponCode ?? "",
          shippingMethodId: props.shippingMethodId,
          paymentMethodId: props.paymentMethodId,
          redirectUrl: props.redirectURL ?? "",
          useDifferentShipping: false,
          billingFirstName: props.billingData.firstName,
          billingLastName: props.billingData.lastName,
          billingAddress1: props.billingData.address1,
          billingAddress2: props.billingData.address2 ?? "",
          billingCity: props.billingData.city,
          billingState: props.billingData.state,
          billingPostcode: props.billingData.postcode,
          billingCountry: props.billingData.country,
          billingPhone: props.billingData.phone,
          billingEmail: props.billingData.email,
          billingCompany: props.billingData.company,
          customFields: props.customFields,
        }),
      })
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();

    if (json["success"] != true) throw new Error();
    return json as HWCOrder;
  } catch (error) {
    console.error(error);
    throw new Error(
      "Invalid response from WooCommerce Server. Couldn't create an order"
    );
  }
}
