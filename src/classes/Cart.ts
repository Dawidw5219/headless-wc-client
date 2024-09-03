import { HWCCartItem } from "../types/CartItem";
import { HWCCustomerData } from "../types/CustomerData";
import { HWCOrder } from "../types/Order";
import { HWCPaymentMethod } from "../types/PaymentMethod";
import { HWCProductType } from "../types/Product";
import { HWCShippingMethod } from "../types/ShippingMethod";
import { HWCCartResponse } from "../types/CartResponse";

export class HCCart {
  readonly url: string;
  readonly products: HWCProductType[];
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
    products: HWCProductType[];
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

  get total(): number {
    return this.subtotal + this.shippingTotal - this.discountTotal;
  }

  static async create(url: string, items: HWCCartItem[] = []): Promise<HCCart> {
    const cart = await HCCart.fetchCart(url, items);
    const { total, ...rest } = cart;
    return new HCCart({ url, ...rest });
  }

  changeShippingMethod(shippingMethodId: string): HCCart {
    const shippingMethod = this.availableShippingMethods.find((item) => item.id === shippingMethodId);
    if (!shippingMethod) throw new Error("Provided shippingMethodId is invalid");
    console.log("changeShippingMethod");
    console.log(
      this.cloneWithUpdates({
        shippingTotal: shippingMethod.price,
      })
    );
    return this.cloneWithUpdates({
      shippingTotal: shippingMethod.price,
    });
  }

  changeQty(productId: number, newQuantity: number): HCCart {
    let priceDifference = 0;
    const newProducts = this.products.map((product) => {
      if (product.id === productId) {
        priceDifference = newQuantity * product.price - product.total;
        return { ...product, quantity: newQuantity, total: newQuantity * product.price };
      }
      return product;
    });
    const newSubtotal = this.subtotal + priceDifference;
    console.log("changeQty");
    console.log(
      this.cloneWithUpdates({
        products: newProducts,
        subtotal: newSubtotal,
      })
    );
    return this.cloneWithUpdates({
      products: newProducts,
      subtotal: newSubtotal,
    });
  }

  async addProduct(cartItem: HWCCartItem): Promise<HCCart> {
    const existingCartItem = this.cartItems.find((item) => item.id === cartItem.id);
    if (existingCartItem) {
      return this.changeQty(cartItem.id, cartItem.quantity + existingCartItem.quantity);
    }
    const newCartItems = [...this.cartItems, cartItem];
    const serverRes = await HCCart.fetchCart(this.url, newCartItems);
    return new HCCart({ url: this.url, ...serverRes });
  }

  async removeProduct(productId: number): Promise<HCCart> {
    const newCartItems = this.cartItems.filter((item) => item.id !== productId);
    if (newCartItems.length === this.cartItems.length) {
      return this;
    }
    const serverRes = await HCCart.fetchCart(this.url, newCartItems);
    return new HCCart({ url: this.url, ...serverRes });
  }

  async addCouponCode(couponCode: string): Promise<HCCart | undefined> {
    if (this.couponCode == couponCode && couponCode != "") {
      throw new Error("You already using this coupon code");
    }
    const response = await HCCart.fetchCart(this.url, this.cartItems, couponCode);
    const { total, ...rest } = response;
    rest.shippingTotal = this.shippingTotal;
    const newCart = new HCCart({ url: this.url, ...rest });
    if (newCart.couponCode !== couponCode) {
      return undefined;
    }
    console.log("addCouponCode");
    console.log(newCart);
    return newCart;
  }

  async removeCouponCode(): Promise<HCCart> {
    return (await this.addCouponCode("")) as HCCart;
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

  private cloneWithUpdates(updates: Partial<HCCart>): HCCart {
    return new HCCart({ ...this, ...updates });
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