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
  HWCProduct: () => HWCProduct,
  HeadlessWC: () => HeadlessWC_default,
  HeadlessWCCart: () => HCCart
});
module.exports = __toCommonJS(src_exports);

// src/classes/Cart.ts
var HCCart = class _HCCart {
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
    const cart = await _HCCart.fetchCart(url, items);
    const { total, ...rest } = cart;
    return new _HCCart({ url, ...rest });
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
    const serverRes = await _HCCart.fetchCart(this.url, newCartItems);
    return new _HCCart({ url: this.url, ...serverRes });
  }
  async removeProduct(productId) {
    const newCartItems = this.cartItems.filter((item) => item.id !== productId);
    if (newCartItems.length === this.cartItems.length) {
      return this;
    }
    const serverRes = await _HCCart.fetchCart(this.url, newCartItems);
    return new _HCCart({ url: this.url, ...serverRes });
  }
  async addCouponCode(couponCode) {
    if (this.couponCode == couponCode && couponCode != "") {
      throw new Error("You already using this coupon code");
    }
    const response = await _HCCart.fetchCart(this.url, this.cartItems, couponCode);
    const { total, ...rest } = response;
    rest.shippingTotal = this.shippingTotal;
    const newCart = new _HCCart({ url: this.url, ...rest });
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
    return new _HCCart({ ...this, ...updates });
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

// src/classes/Product.ts
var HWCProduct = class _HWCProduct {
  type;
  weight_unit;
  dimension_unit;
  height;
  length;
  weight;
  width;
  gallery_images;
  upsell_ids;
  cross_sell_ids;
  content;
  is_on_sale;
  is_virtual;
  is_featured;
  is_sold_individually;
  image;
  id;
  name;
  stock_quantity;
  stock_status;
  slug;
  permalink;
  currency;
  price;
  regular_price;
  attributes;
  categories;
  tags;
  sale_price;
  sale_start_datetime;
  sale_end_datetime;
  sku;
  global_unique_id;
  short_description;
  variations_min_price;
  variations_max_price;
  variations;
  constructor(props) {
    Object.assign(this, props);
  }
  toJSON() {
    return JSON.stringify({
      weight_unit: this.weight_unit,
      dimension_unit: this.dimension_unit,
      height: this.height,
      length: this.length,
      weight: this.weight,
      width: this.width,
      gallery_images: this.gallery_images,
      upsell_ids: this.upsell_ids,
      content: this.content,
      is_on_sale: this.is_on_sale,
      is_virtual: this.is_virtual,
      is_featured: this.is_featured,
      is_sold_individually: this.is_sold_individually,
      image: this.image,
      id: this.id,
      name: this.name,
      stock_quantity: this.stock_quantity,
      stock_status: this.stock_status,
      slug: this.slug,
      permalink: this.permalink,
      currency: this.currency,
      price: this.price,
      regular_price: this.regular_price,
      attributes: this.attributes,
      categories: this.categories,
      tags: this.tags,
      sale_price: this.sale_price,
      sale_start_datetime: this.sale_start_datetime,
      sale_end_datetime: this.sale_end_datetime,
      sku: this.sku,
      global_unique_id: this.global_unique_id,
      short_description: this.short_description,
      type: this.type,
      variations_min_price: this.variations_min_price,
      variations_max_price: this.variations_max_price,
      variations: this.variations
    });
  }
  cloneWithUpdates(updates) {
    return new _HWCProduct({
      ...this,
      ...updates
    });
  }
  updateVariation(attributeValues) {
    var _a;
    const variation = (_a = this.variations.find(
      (variation2) => Object.entries(attributeValues).every(([key, value]) => variation2.attribute_values[key] === value)
    )) == null ? void 0 : _a.variation;
    if (!variation)
      return this;
    return this.cloneWithUpdates({
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
    });
  }
};

// src/api/getProduct.ts
async function getProduct(url, idOrSlug) {
  try {
    const response = await fetch(`${url}/wp-json/headless-wc/v1/products/${idOrSlug}`, {
      cache: "no-store"
    });
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data["success"] != true)
      throw new Error();
    return new HWCProduct(data.data);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// src/api/getProducts.ts
async function getProducts(url) {
  try {
    const response = await fetch(`${url}/wp-json/headless-wc/v1/products`, {
      cache: "no-store"
    });
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data["success"] != true)
      throw new Error();
    return data.data;
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
      this.cartInstancePromise = HCCart.create(this.url, items);
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
  getProductFromJSON(json) {
    const data = typeof json === "string" ? JSON.parse(json) : json;
    return new HWCProduct(data);
  }
};
var HeadlessWC_default = HeadlessWC;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HWCProduct,
  HeadlessWC,
  HeadlessWCCart
});
