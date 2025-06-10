import { HWCCartProduct } from "../types/CartProduct";
import { HWCCustomerData } from "../types/CustomerData";
import { HWCOrder } from "../types/Order";
import { HWCPaymentMethod } from "../types/PaymentMethod";
import { HWCShippingMethod } from "../types/ShippingMethod";
import { ErrorResp } from "../types/Response";
import { createCart } from "../api/createCart";
import { createOrder } from "../api/createOrder";
import { HWCProductDetailed } from "../types/ProductDetailed";
import { HWCCartType } from "../types/Cart";

export class HWCCart implements HWCCartType {
  total: number;
  readonly url: string;
  readonly products: HWCCartProduct[];
  readonly subtotal: number;
  readonly taxTotal: number;
  readonly discountTotal: number;
  readonly shippingTotal: number;
  readonly couponCode: string;
  readonly currency: string;
  readonly shippingMethods: HWCShippingMethod[];
  readonly paymentMethods: HWCPaymentMethod[];
  readonly customFields?: { [key: string]: any };

  private constructor(props: HWCCartType & { url: string }) {
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

  private cloneWithUpdates(updates: Partial<HWCCart>): HWCCart {
    const updatedCart = new HWCCart({ ...this, ...updates });
    updatedCart.total =
      updatedCart.subtotal +
      updatedCart.shippingTotal -
      updatedCart.discountTotal;
    return updatedCart;
  }

  static async create(
    url: string,
    cartItems: (
      | { id: number; quantity: number }
      | { slug: string; quantity: number }
    )[] = [],
    customFields?: { [key: string]: any }
  ): Promise<HWCCart> {
    const cart = await createCart(url, cartItems, "", customFields);
    if (cart.success === false) {
      throw new Error(cart.message);
    }
    return new HWCCart({ ...cart.data, url });
  }

  async revalidateWithServer(): Promise<HWCCart> {
    const fetchCart = await createCart(
      this.url,
      this.cartItems,
      this.couponCode,
      this.customFields
    );
    if (fetchCart.success === false) {
      throw new Error(fetchCart.message);
    }
    return new HWCCart({ url: this.url, ...fetchCart.data });
  }

  changeShippingMethod(shippingMethodId: string): HWCCart {
    const shippingMethod = this.shippingMethods.find(
      (item) => item.id === shippingMethodId
    );
    if (!shippingMethod)
      throw new Error("Provided shippingMethodId is invalid");
    return this.cloneWithUpdates({
      shippingTotal: shippingMethod.price,
    });
  }

  changeQty(productId: number, newQuantity: number): HWCCart {
    // Find the product to update
    const updatedProducts = this.products.map((product) => {
      if (product.id === productId) {
        // Calculate the new total for the product
        const newTotal = parseFloat((newQuantity * product.price).toFixed(2));
        // Return the updated product
        return { ...product, quantity: newQuantity, total: newTotal };
      }
      return product;
    });

    // Calculate the price difference
    const priceDifference = updatedProducts.reduce((acc, product) => {
      const originalProduct = this.products.find((p) => p.id === product.id);
      if (originalProduct) {
        return acc + (product.total - originalProduct.total);
      }
      return acc;
    }, 0);

    // Ensure subtotal is a number and calculate the new subtotal
    const currentSubtotal =
      typeof this.subtotal === "number"
        ? this.subtotal
        : parseFloat(this.subtotal);
    const newSubtotal = parseFloat(
      (currentSubtotal + priceDifference).toFixed(2)
    );

    // Return a new cart instance with updated products and subtotal
    return this.cloneWithUpdates({
      products: updatedProducts,
      subtotal: newSubtotal,
    });
  }

  addProduct(product: HWCProductDetailed): HWCCart {
    const existingCartItem = this.cartItems.find(
      (cartItem) => cartItem.id === product.id
    );
    if (existingCartItem) {
      return this.changeQty(product.id, 1 + existingCartItem.quantity);
    }
    const cartProduct: HWCCartProduct = {
      quantity: 1,
      tax: 0,
      variation: null,
      total: product.price,
      variationId: "variationId" in product ? product.variationId : null,
      ...product,
    };
    return this.cloneWithUpdates({
      products: [...this.products, cartProduct],
      subtotal: this.subtotal + product.price,
    });
  }

  async addProductById(cartItem: {
    id: number;
    quantity: number;
  }): Promise<HWCCart> {
    const existingCartItem = this.cartItems.find(
      (item) => item.id === cartItem.id
    );
    if (existingCartItem) {
      return this.changeQty(
        cartItem.id,
        cartItem.quantity + existingCartItem.quantity
      );
    }
    const fetchCart = await createCart(
      this.url,
      [...this.cartItems, cartItem],
      this.couponCode,
      this.customFields
    );
    if (fetchCart.success === false) {
      throw new Error(fetchCart.message);
    }
    return new HWCCart({ url: this.url, ...fetchCart.data });
  }

  async addProductBySlug(cartItem: {
    slug: string;
    quantity: number;
  }): Promise<HWCCart> {
    const fetchCart = await createCart(
      this.url,
      [...this.cartItems, cartItem],
      this.couponCode,
      this.customFields
    );
    if (fetchCart.success === false) {
      throw new Error(fetchCart.message);
    }
    return new HWCCart({ url: this.url, ...fetchCart.data });
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
    const fetchCart = await createCart(
      this.url,
      newCartItems,
      this.couponCode,
      this.customFields
    );
    if (fetchCart.success === false) {
      throw new Error(fetchCart.message);
    }
    return new HWCCart({ url: this.url, ...fetchCart.data });
  }

  async addCouponCode(couponCode: string): Promise<HWCCart | undefined> {
    if (this.couponCode == couponCode && couponCode != "") {
      throw new Error("You already using this coupon code");
    }
    const fetchCart = await createCart(
      this.url,
      this.cartItems,
      couponCode,
      this.customFields
    );
    if (fetchCart.success === false) {
      throw new Error(fetchCart.message);
    }
    const newCart = new HWCCart({
      url: this.url,
      ...fetchCart.data,
    });
    if (newCart.couponCode !== couponCode) {
      return undefined;
    }
    return newCart;
  }

  async removeCouponCode(): Promise<HWCCart> {
    return (await this.addCouponCode("")) as HWCCart;
  }

  async updateCustomFields(customFields: {
    [key: string]: any;
  }): Promise<HWCCart> {
    const mergedCustomFields = {
      ...this.customFields,
      ...customFields,
    };
    const fetchCart = await createCart(
      this.url,
      this.cartItems,
      this.couponCode,
      mergedCustomFields
    );
    if (fetchCart.success === false) {
      throw new Error(fetchCart.message);
    }
    return new HWCCart({ url: this.url, ...fetchCart.data });
  }

  async submitOrder(props: {
    billingData: HWCCustomerData;
    shippingData?: HWCCustomerData;
    shippingMethodId: string;
    paymentMethodId: string;
    redirectURL?: string;
    furgonetkaPoint?: string;
    furgonetkaPointName?: string;
    customFields?: { [key: string]: any };
  }): Promise<HWCOrder> {
    // Merge customFields from cart with customFields from props
    const mergedCustomFields = {
      ...this.customFields,
      ...props.customFields,
    };

    const result = await createOrder(this.url, {
      cartItems: this.cartItems,
      couponCode: this.couponCode,
      ...props,
      customFields: mergedCustomFields,
    });

    if (result.success === false) {
      throw new Error(result.message);
    }

    return result.data;
  }
}
