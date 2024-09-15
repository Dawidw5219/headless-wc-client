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
  HWCCart: () => HWCCart,
  HeadlessWC: () => HeadlessWC,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/api/createCart.ts
async function createCart(url, products, couponCode = "") {
  try {
    const res = await fetch(`${url}/wp-json/headless-wc/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({ cart: products, couponCode })
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json["success"] != true) throw new Error();
    return json;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// src/api/createOrder.ts
async function createOrder(props) {
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
        furgonetkaPointName: props.furgonetkaPointName
      })
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json["success"] != true) throw new Error();
    return json;
  } catch (error) {
    throw new Error("Invalid response from WooCommerce Server. Couldn't create an order");
  }
}

// src/classes/Cart.ts
var HWCCart = class _HWCCart {
  url;
  products;
  subtotal;
  tax_total;
  discount_total;
  shipping_total;
  coupon_code;
  currency;
  shipping_methods;
  payment_methods;
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
    return (this.subtotal + this.shipping_total - this.discount_total).toFixed(2);
  }
  static async create(url, cartItems = []) {
    const cart = await createCart(url, cartItems);
    const { total, ...rest } = cart;
    return new _HWCCart({ url, ...rest });
  }
  async revalidateWithServer() {
    const fetchCart = await createCart(this.url, this.cartItems);
    return new _HWCCart({ url: this.url, ...fetchCart });
  }
  changeShippingMethod(shippingMethodId) {
    const shippingMethod = this.shipping_methods.find((item) => item.id === shippingMethodId);
    if (!shippingMethod) throw new Error("Provided shippingMethodId is invalid");
    return this.cloneWithUpdates({
      shipping_total: shippingMethod.price
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
    return this.cloneWithUpdates({
      products: newProducts,
      subtotal: newSubtotal
    });
  }
  addProduct(product) {
    const existingCartItem = this.cartItems.find((cartItem) => cartItem.id === product.id);
    if (existingCartItem) {
      return this.changeQty(product.id, 1 + existingCartItem.quantity);
    }
    const cartProduct = {
      quantity: 1,
      tax: 0,
      variation: null,
      total: product.price,
      variation_id: "variation_id" in product ? product.variation_id : null,
      ...product
    };
    return this.cloneWithUpdates({
      products: [...this.products, cartProduct]
    });
  }
  async addProductById(cartItem) {
    const existingCartItem = this.cartItems.find((item) => item.id === cartItem.id);
    if (existingCartItem) {
      return this.changeQty(cartItem.id, cartItem.quantity + existingCartItem.quantity);
    }
    const fetchCart = await createCart(this.url, [...this.cartItems, cartItem]);
    return new _HWCCart({ url: this.url, ...fetchCart });
  }
  removeProduct(product) {
    const newProducts = this.products.filter((item) => item.id !== product.id);
    return this.cloneWithUpdates({
      products: newProducts
    });
  }
  async removeProductById(productId) {
    const newCartItems = this.cartItems.filter((item) => item.id !== productId);
    if (newCartItems.length === this.cartItems.length) {
      return this;
    }
    const fetchCart = await createCart(this.url, newCartItems);
    const { total, ...rest } = fetchCart;
    return new _HWCCart({ url: this.url, ...rest });
  }
  async addCouponCode(couponCode) {
    if (this.coupon_code == couponCode && couponCode != "") {
      throw new Error("You already using this coupon code");
    }
    const fetchCart = await createCart(this.url, this.cartItems, couponCode);
    const { total, ...rest } = fetchCart;
    rest.shipping_total = this.shipping_total;
    rest.discount_total = this.discount_total;
    const newCart = new _HWCCart({ url: this.url, ...rest });
    if (newCart.coupon_code !== couponCode) {
      return void 0;
    }
    return newCart;
  }
  async removeCouponCode() {
    return await this.addCouponCode("");
  }
  async submitOrder(props) {
    return await createOrder(props);
  }
  cloneWithUpdates(updates) {
    return new _HWCCart({ ...this, ...updates });
  }
};

// src/api/getProduct.ts
async function getProduct(url, idOrSlug) {
  try {
    const isDevEnv = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
    const res = await fetch(`${url}/wp-json/headless-wc/v1/products/${idOrSlug}`, {
      cache: isDevEnv ? "no-store" : "default"
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json["success"] != true) throw new Error();
    return json.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// src/api/getProducts.ts
async function getProducts(url) {
  try {
    const isDevEnv = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
    const res = await fetch(`${url}/wp-json/headless-wc/v1/products`, {
      cache: isDevEnv ? "no-store" : "default"
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json["success"] != true) throw new Error();
    return json.data;
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
      this.cartInstancePromise = HWCCart.create(this.url, items);
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
  static selectProductVariation(product, attributeValues) {
    var _a;
    if (product.type !== "variable") throw new Error("Cannot select variation for non-variable product");
    const variation = (_a = product.variations.find(
      (variation2) => Object.entries(attributeValues).every(([key, value]) => variation2.attribute_values[key] === value)
    )) == null ? void 0 : _a.variation;
    if (!variation) return product;
    return {
      ...product,
      is_on_sale: variation.is_on_sale,
      is_virtual: variation.is_virtual,
      is_featured: variation.is_featured,
      is_sold_individually: variation.is_sold_individually,
      image: variation.image,
      id: variation.id,
      name: variation.name,
      stock_quantity: variation.stock_quantity,
      stock_status: variation.stock_status,
      slug: variation.slug,
      permalink: variation.permalink,
      currency: variation.currency,
      price: variation.price,
      regular_price: variation.regular_price,
      sale_price: variation.sale_price,
      sale_start_datetime: variation.sale_start_datetime,
      sale_end_datetime: variation.sale_end_datetime,
      sku: variation.sku,
      global_unique_id: variation.global_unique_id,
      content: variation.content
    };
  }
};

// src/index.ts
var src_default = HeadlessWC;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HWCCart,
  HeadlessWC
});
