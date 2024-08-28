var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  HeadlessWC: () => HeadlessWC_default,
  HeadlessWCCart: () => HeadlessWCCart
});
module.exports = __toCommonJS(src_exports);

// src/HeadlessWCCart.ts
var HeadlessWCCart = class _HeadlessWCCart {
  url;
  products;
  subtotal;
  taxTotal;
  discountTotal;
  shippingTotal;
  couponCode;
  currency;
  availableShippingMethods;
  availablePaymentMethods;
  constructor(props) {
    Object.assign(this, props);
  }
  get cartItems() {
    return this.products.map((product) => {
      return {
        id: product.id,
        quantity: product.quantity
      };
    });
  }
  get total() {
    return this.subtotal + this.shippingTotal - this.discountTotal;
  }
  static async create(url, items = []) {
    const cart = await _HeadlessWCCart.fetchCart(url, items);
    const { total, ...rest } = cart;
    return new _HeadlessWCCart({ url, ...rest });
  }
  changeShippingMethod(shippingMethodId) {
    const shippingMethod = this.availableShippingMethods.find((item) => item.id === shippingMethodId);
    if (!shippingMethod)
      throw new Error("Provided shippingMethodId is invalid");
    console.log("changeShippingMethod");
    console.log(
      this.cloneWithUpdates({
        shippingTotal: shippingMethod.price
      })
    );
    return this.cloneWithUpdates({
      shippingTotal: shippingMethod.price
    });
  }
  changeQty(productId, newQuantity) {
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
        subtotal: newSubtotal
      })
    );
    return this.cloneWithUpdates({
      products: newProducts,
      subtotal: newSubtotal
    });
  }
  async addProduct(cartItem) {
    const existingCartItem = this.cartItems.find((item) => item.id === cartItem.id);
    if (existingCartItem) {
      return this.changeQty(cartItem.id, cartItem.quantity + existingCartItem.quantity);
    }
    const newCartItems = [...this.cartItems, cartItem];
    const serverRes = await _HeadlessWCCart.fetchCart(this.url, newCartItems);
    return new _HeadlessWCCart({ url: this.url, ...serverRes });
  }
  async removeProduct(productId) {
    const newCartItems = this.cartItems.filter((item) => item.id !== productId);
    if (newCartItems.length === this.cartItems.length) {
      return this;
    }
    const serverRes = await _HeadlessWCCart.fetchCart(this.url, newCartItems);
    return new _HeadlessWCCart({ url: this.url, ...serverRes });
  }
  async addCouponCode(couponCode) {
    if (this.couponCode == couponCode && couponCode != "") {
      throw new Error("You already using this coupon code");
    }
    const response = await _HeadlessWCCart.fetchCart(this.url, this.cartItems, couponCode);
    const { total, ...rest } = response;
    rest.shippingTotal = this.shippingTotal;
    const newCart = new _HeadlessWCCart({ url: this.url, ...rest });
    if (newCart.couponCode !== couponCode) {
      return void 0;
    }
    console.log("addCouponCode");
    console.log(newCart);
    return newCart;
  }
  async removeCouponCode() {
    return await this.addCouponCode("");
  }
  async submitOrder(props) {
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
          furgonetkaPointName: props.furgonetkaPointName
        })
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data["success"] != true)
        throw new Error();
      return data;
    } catch (error) {
      throw new Error("Invalid response from WooCommerce Server. Couldn't create an order");
    }
  }
  cloneWithUpdates(updates) {
    return new _HeadlessWCCart({ ...this, ...updates });
  }
  static async fetchCart(url, products, couponCode = "") {
    try {
      const response = await fetch(`${url}/wp-json/headless-wc/v1/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: products, couponCode })
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data["success"] != true)
        throw new Error();
      return data;
    } catch (error) {
      console.error("Fetch cart error:", error);
      throw error;
    }
  }
};

// src/api/getProduct.ts
async function getProduct(url, idOrSlug) {
  try {
    const response = await fetch(`${url}/wp-json/headless-wc/v1/products/${idOrSlug}`);
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data["success"] != true)
      throw new Error();
    return data.product;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// src/api/getProducts.ts
async function getProducts(url) {
  try {
    const response = await fetch(`${url}/wp-json/headless-wc/v1/products`);
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data["success"] != true)
      throw new Error();
    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// src/HeadlessWC.ts
var HeadlessWC = class {
  url;
  cartInstancePromise = void 0;
  constructor(url) {
    this.url = url;
  }
  async createCart(items = []) {
    if (!this.cartInstancePromise) {
      this.cartInstancePromise = HeadlessWCCart.create(this.url, items);
    }
    return this.cartInstancePromise;
  }
  async getProducts() {
    return await getProducts(this.url);
  }
  async getProductById(id) {
    return await getProduct(this.url, id);
  }
  async getProductBySlug(slug) {
    return await getProduct(this.url, slug);
  }
};
var HeadlessWC_default = HeadlessWC;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HeadlessWC,
  HeadlessWCCart
});
