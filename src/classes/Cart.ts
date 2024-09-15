import { HWCCartProduct } from "../types/CartProduct";
import { HWCCustomerData } from "../types/CustomerData";
import { HWCOrder } from "../types/Order";
import { HWCPaymentMethod } from "../types/PaymentMethod";
import { HWCShippingMethod } from "../types/ShippingMethod";
import { createCart } from "../api/createCart";
import { createOrder } from "../api/createOrder";
import { HWCProductDetailed } from "../types/ProductDetailed";

export class HWCCart {
  readonly url: string;
  readonly products: HWCCartProduct[];
  readonly subtotal: number;
  readonly tax_total: number;
  readonly discount_total: number;
  readonly shipping_total: number;
  readonly coupon_code: string;
  readonly currency: string;
  readonly shipping_methods: HWCShippingMethod[];
  readonly payment_methods: HWCPaymentMethod[];

  private constructor(props: {
    url: string;
    products: HWCCartProduct[];
    subtotal: number;
    tax_total: number;
    discount_total: number;
    shipping_total: number;
    coupon_code: string;
    currency: string;
    shipping_methods: HWCShippingMethod[];
    payment_methods: HWCPaymentMethod[];
  }) {
    Object.assign(this, props);
  }

  private get cartItems(): { id: number; quantity: number }[] {
    return this.products.map((product) => {
      return {
        id: product.id,
        quantity: product.quantity,
      };
    });
  }

  get total(): string {
    return (this.subtotal + this.shipping_total - this.discount_total).toFixed(2);
  }

  static async create(url: string, cartItems: { id: number; quantity: number }[] = []): Promise<HWCCart> {
    const cart = await createCart(url, cartItems);
    const { total, ...rest } = cart;
    return new HWCCart({ url, ...rest });
  }

  async revalidateWithServer(): Promise<HWCCart> {
    const fetchCart = await createCart(this.url, this.cartItems);
    return new HWCCart({ url: this.url, ...fetchCart });
  }

  changeShippingMethod(shippingMethodId: string): HWCCart {
    const shippingMethod = this.shipping_methods.find((item) => item.id === shippingMethodId);
    if (!shippingMethod) throw new Error("Provided shippingMethodId is invalid");
    return this.cloneWithUpdates({
      shipping_total: shippingMethod.price,
    });
  }

  changeQty(productId: number, newQuantity: number): HWCCart {
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
    });
  }

  addProduct(product: HWCProductDetailed): HWCCart {
    const existingCartItem = this.cartItems.find((cartItem) => cartItem.id === product.id);
    if (existingCartItem) {
      return this.changeQty(product.id, 1 + existingCartItem.quantity);
    }
    const cartProduct: HWCCartProduct = {
      quantity: 1,
      tax: 0,
      variation: null,
      total: product.price,
      variation_id: "variation_id" in product ? product.variation_id : null,
      ...product,
    };
    return this.cloneWithUpdates({
      products: [...this.products, cartProduct],
    });
  }

  async addProductById(cartItem: { id: number; quantity: number }): Promise<HWCCart> {
    const existingCartItem = this.cartItems.find((item) => item.id === cartItem.id);
    if (existingCartItem) {
      return this.changeQty(cartItem.id, cartItem.quantity + existingCartItem.quantity);
    }
    const fetchCart = await createCart(this.url, [...this.cartItems, cartItem]);
    return new HWCCart({ url: this.url, ...fetchCart });
  }

  removeProduct(product: HWCProductDetailed): HWCCart {
    const newProducts = this.products.filter((item) => item.id !== product.id);
    return this.cloneWithUpdates({
      products: newProducts,
    });
  }

  async removeProductById(productId: number): Promise<HWCCart> {
    const newCartItems = this.cartItems.filter((item) => item.id !== productId);
    if (newCartItems.length === this.cartItems.length) {
      return this;
    }
    const fetchCart = await createCart(this.url, newCartItems);
    const { total, ...rest } = fetchCart;
    return new HWCCart({ url: this.url, ...rest });
  }

  async addCouponCode(couponCode: string): Promise<HWCCart | undefined> {
    if (this.coupon_code == couponCode && couponCode != "") {
      throw new Error("You already using this coupon code");
    }
    const fetchCart = await createCart(this.url, this.cartItems, couponCode);
    const { total, ...rest } = fetchCart;
    rest.shipping_total = this.shipping_total;
    rest.discount_total = this.discount_total;
    const newCart = new HWCCart({ url: this.url, ...rest });
    if (newCart.coupon_code !== couponCode) {
      return undefined;
    }
    return newCart;
  }

  async removeCouponCode(): Promise<HWCCart> {
    return (await this.addCouponCode("")) as HWCCart;
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
    return await createOrder(props);
  }

  private cloneWithUpdates(updates: Partial<HWCCart>): HWCCart {
    return new HWCCart({ ...this, ...updates });
  }
}
