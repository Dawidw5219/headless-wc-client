import { HWCCartItem } from "./types/HWCCartItem";
import { HWCCustomerData } from "./types/HWCCustomerData";
import { HWCOrder } from "./types/HWCOrder";
import { HWCPaymentMethod } from "./types/HWCPaymentMethod";
import { HWCProduct } from "./types/HWCProduct";
import { HWCShippingMethod } from "./types/HWCShippingMethod";
import { HWCCartResponse } from "./types/HWCCartResponse";

export class HeadlessWCCart {
  readonly url: string;
  readonly products: HWCProduct[];
  readonly total: number;
  readonly subtotal: number;
  readonly taxTotal: number;
  readonly discountTotal: number;
  readonly shippingTotal: number;
  readonly couponCode: string;
  readonly currency: string;
  readonly availableShippingMethods: HWCShippingMethod[];
  readonly availablePaymentMethods: HWCPaymentMethod[];

  private constructor(props: {
    url: string;
    products: HWCProduct[];
    total: number;
    subtotal: number;
    taxTotal: number;
    discountTotal: number;
    shippingTotal: number;
    couponCode: string;
    currency: string;
    availableShippingMethods: HWCShippingMethod[];
    availablePaymentMethods: HWCPaymentMethod[];
  }) {
    Object.assign(this, props);
  }

  get cartItems(): HWCCartItem[] {
    return this.products.map((product): HWCCartItem => {
      return {
        id: product.id,
        quantity: product.quantity,
      };
    });
  }

  static async create(url: string, items: HWCCartItem[] = []): Promise<HeadlessWCCart> {
    const cart = await HeadlessWCCart.fetchCart(url, items);
    return new HeadlessWCCart({ url, ...cart });
  }

  changeShippingMethod(shippingMethodId: string): HeadlessWCCart {
    const shippingMethod = this.availableShippingMethods.find((item) => item.id === shippingMethodId);
    if (!shippingMethod) throw new Error("Provided shippingMethodId is invalid");
    return this.cloneWithUpdates({
      shippingTotal: shippingMethod.price,
      total: this.subtotal + shippingMethod.price,
    });
  }

  changeQty(productId: number, newQuantity: number): HeadlessWCCart {
    let priceDifference = 0;
    const newProducts = this.products.map((product) => {
      if (product.id === productId) {
        priceDifference = newQuantity * product.price - product.total;
        return { ...product, quantity: newQuantity, total: newQuantity * product.price };
      }
      return product;
    });
    const newSubtotal = this.subtotal + priceDifference;
    return this.cloneWithUpdates({
      products: newProducts,
      subtotal: newSubtotal,
      total: newSubtotal + this.shippingTotal,
    });
  }

  async addProduct(cartItem: HWCCartItem): Promise<HeadlessWCCart> {
    const existingCartItem = this.cartItems.find((item) => item.id === cartItem.id);
    if (existingCartItem) {
      return this.changeQty(cartItem.id, cartItem.quantity + existingCartItem.quantity);
    }
    const newCartItems = [...this.cartItems, cartItem];
    const serverRes = await HeadlessWCCart.fetchCart(this.url, newCartItems);
    return new HeadlessWCCart({ url: this.url, ...serverRes });
  }

  async removeProduct(productId: number): Promise<HeadlessWCCart> {
    const newCartItems = this.cartItems.filter((item) => item.id !== productId);
    if (newCartItems.length === this.cartItems.length) {
      return this;
    }
    const serverRes = await HeadlessWCCart.fetchCart(this.url, newCartItems);
    return new HeadlessWCCart({ url: this.url, ...serverRes });
  }

  async addCouponCode(couponCode: string): Promise<HeadlessWCCart | undefined> {
    if (this.couponCode == couponCode && couponCode != "") {
      throw new Error("You already using this coupon code");
    }
    const serverRes = await HeadlessWCCart.fetchCart(this.url, this.cartItems, couponCode);
    const newCart = new HeadlessWCCart({ url: this.url, ...serverRes });
    if (newCart.couponCode !== couponCode) {
      return undefined;
    }
    return newCart;
  }

  async removeCouponCode(): Promise<HeadlessWCCart> {
    return (await this.addCouponCode("")) as HeadlessWCCart;
  }

  async submitOrder(props: {
    billingData: HWCCustomerData;
    shippingData?: HWCCustomerData;
    shippingMethodId: string;
    paymentMethodId: string;
    redirectURL?: string;
    furgonetkaPoint?: string;
    furgonetkaPointName?: string;
  }): Promise<HWCOrder> {
    try {
      const response = await fetch(`${this.url}/wp-json/headless-wc/v1/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: this.cartItems,
          coupon_code: this.couponCode,
          total: this.total,
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

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data["success"] != true) throw new Error();
      return data as HWCOrder;
    } catch (error) {
      throw new Error("Invalid response from WooCommerce Server. Couldn't create an order");
    }
  }

  private cloneWithUpdates(updates: Partial<HeadlessWCCart>): HeadlessWCCart {
    return new HeadlessWCCart({ ...this, ...updates });
  }

  private static async fetchCart(
    url: string,
    products: HWCCartItem[],
    couponCode: string = ""
  ): Promise<HWCCartResponse> {
    try {
      const response = await fetch(`${url}/wp-json/headless-wc/v1/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: products, couponCode }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data["success"] != true) throw new Error();
      return data as HWCCartResponse;
    } catch (error) {
      console.error("Fetch cart error:", error);
      throw error;
    }
  }
}
