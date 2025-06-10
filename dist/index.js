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

// src/utils/betterFetch.ts
var APP_NAME = "HeadlessWC";
function isDevEnvironment() {
  var _a, _b;
  if (typeof window !== "undefined") {
    const hostname = (_a = window.location) == null ? void 0 : _a.hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || (hostname == null ? void 0 : hostname.includes("localhost")) || ((_b = window.location) == null ? void 0 : _b.port) === "3000";
  }
  return process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "development" || !process.env.NODE_ENV;
}
async function betterFetch(url, options = {}) {
  const { retries = 3, retryDelay = 1e3, ...fetchOptions } = options;
  const isDev = isDevEnvironment();
  if (!fetchOptions.cache) {
    fetchOptions.cache = isDev ? "no-store" : "default";
  }
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);
      if (response.ok) {
        return response;
      }
      let responseBody = "[Could not read response]";
      try {
        const clone = response.clone();
        const text = await clone.text();
        responseBody = text ? JSON.parse(text) : text;
      } catch {
      }
      lastError = new Error(`HTTP error! status: ${response.status}`);
      if (attempt === retries && isDev) {
        console.error(`[${APP_NAME}] \u{1F6A8} Request failed:`, {
          url,
          method: fetchOptions.method || "GET",
          status: response.status,
          statusText: response.statusText,
          responseBody,
          attempts: retries
        });
      }
      if (attempt === retries) {
        return response;
      }
      if (isDev) {
        console.warn(
          `[${APP_NAME}] \u23F3 HTTP ${response.status} - Retry ${attempt + 1}/${retries}`
        );
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === retries && isDev) {
        console.error(`[${APP_NAME}] \u{1F6A8} Network error:`, {
          url,
          method: fetchOptions.method || "GET",
          error: lastError.message,
          attempts: retries
        });
      }
      if (attempt === retries) {
        throw lastError;
      }
      if (isDev) {
        console.warn(
          `[${APP_NAME}] \u23F3 Network error - Retry ${attempt + 1}/${retries}`
        );
      }
    }
    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
  throw lastError;
}

// src/api/createCart.ts
async function createCart(url, products, couponCode = "", customFields) {
  try {
    const res = await betterFetch(`${url}/wp-json/headless-wc/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({ cart: products, couponCode, customFields })
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json.success === false) {
      return json;
    }
    return { success: true, data: json };
  } catch (error) {
    return {
      success: false,
      message: "Network or HTTP error occurred",
      error: "internal"
    };
  }
}

// src/api/createOrder.ts
async function createOrder(url, props) {
  try {
    const res = await betterFetch(`${url}/wp-json/headless-wc/v1/order`, {
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
        customFields: props.customFields
      })
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json.success === false) {
      return json;
    }
    return { success: true, data: json };
  } catch (error) {
    return {
      success: false,
      message: "Network or HTTP error occurred",
      error: "internal"
    };
  }
}

// src/classes/Cart.ts
var HWCCart = class _HWCCart {
  total;
  url;
  products;
  subtotal;
  taxTotal;
  discountTotal;
  shippingTotal;
  couponCode;
  currency;
  shippingMethods;
  paymentMethods;
  customFields;
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
  cloneWithUpdates(updates) {
    const updatedCart = new _HWCCart({ ...this, ...updates });
    updatedCart.total = updatedCart.subtotal + updatedCart.shippingTotal - updatedCart.discountTotal;
    return updatedCart;
  }
  static async create(url, cartItems = [], customFields) {
    const cart = await createCart(url, cartItems, "", customFields);
    if (cart.success === false) {
      throw new Error(cart.message);
    }
    return new _HWCCart({ ...cart.data, url });
  }
  async revalidateWithServer() {
    const fetchCart = await createCart(
      this.url,
      this.cartItems,
      this.couponCode,
      this.customFields
    );
    if (fetchCart.success === false) {
      throw new Error(fetchCart.message);
    }
    return new _HWCCart({ url: this.url, ...fetchCart.data });
  }
  changeShippingMethod(shippingMethodId) {
    const shippingMethod = this.shippingMethods.find(
      (item) => item.id === shippingMethodId
    );
    if (!shippingMethod)
      throw new Error("Provided shippingMethodId is invalid");
    return this.cloneWithUpdates({
      shippingTotal: shippingMethod.price
    });
  }
  changeQty(productId, newQuantity) {
    const updatedProducts = this.products.map((product) => {
      if (product.id === productId) {
        const newTotal = parseFloat((newQuantity * product.price).toFixed(2));
        return { ...product, quantity: newQuantity, total: newTotal };
      }
      return product;
    });
    const priceDifference = updatedProducts.reduce((acc, product) => {
      const originalProduct = this.products.find((p) => p.id === product.id);
      if (originalProduct) {
        return acc + (product.total - originalProduct.total);
      }
      return acc;
    }, 0);
    const currentSubtotal = typeof this.subtotal === "number" ? this.subtotal : parseFloat(this.subtotal);
    const newSubtotal = parseFloat(
      (currentSubtotal + priceDifference).toFixed(2)
    );
    return this.cloneWithUpdates({
      products: updatedProducts,
      subtotal: newSubtotal
    });
  }
  addProduct(product) {
    const existingCartItem = this.cartItems.find(
      (cartItem) => cartItem.id === product.id
    );
    if (existingCartItem) {
      return this.changeQty(product.id, 1 + existingCartItem.quantity);
    }
    const cartProduct = {
      quantity: 1,
      tax: 0,
      variation: null,
      total: product.price,
      variationId: "variationId" in product ? product.variationId : null,
      ...product
    };
    return this.cloneWithUpdates({
      products: [...this.products, cartProduct],
      subtotal: this.subtotal + product.price
    });
  }
  async addProductById(cartItem) {
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
    return new _HWCCart({ url: this.url, ...fetchCart.data });
  }
  async addProductBySlug(cartItem) {
    const fetchCart = await createCart(
      this.url,
      [...this.cartItems, cartItem],
      this.couponCode,
      this.customFields
    );
    if (fetchCart.success === false) {
      throw new Error(fetchCart.message);
    }
    return new _HWCCart({ url: this.url, ...fetchCart.data });
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
    const fetchCart = await createCart(
      this.url,
      newCartItems,
      this.couponCode,
      this.customFields
    );
    if (fetchCart.success === false) {
      throw new Error(fetchCart.message);
    }
    return new _HWCCart({ url: this.url, ...fetchCart.data });
  }
  async addCouponCode(couponCode) {
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
    const newCart = new _HWCCart({
      url: this.url,
      ...fetchCart.data
    });
    if (newCart.couponCode !== couponCode) {
      return void 0;
    }
    return newCart;
  }
  async removeCouponCode() {
    return await this.addCouponCode("");
  }
  async updateCustomFields(customFields) {
    const mergedCustomFields = {
      ...this.customFields,
      ...customFields
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
    return new _HWCCart({ url: this.url, ...fetchCart.data });
  }
  async submitOrder(props) {
    const mergedCustomFields = {
      ...this.customFields,
      ...props.customFields
    };
    const result = await createOrder(this.url, {
      cartItems: this.cartItems,
      couponCode: this.couponCode,
      ...props,
      customFields: mergedCustomFields
    });
    if (result.success === false) {
      throw new Error(result.message);
    }
    return result.data;
  }
};

// src/api/getProduct.ts
async function getProduct(url, idOrSlug) {
  try {
    const res = await betterFetch(
      `${url}/wp-json/headless-wc/v1/products/${idOrSlug}`
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json.success === false) {
      return json;
    }
    return { success: true, data: json };
  } catch (error) {
    return {
      success: false,
      message: "Network or HTTP error occurred",
      error: "internal"
    };
  }
}

// src/api/getProducts.ts
async function getProducts(url) {
  try {
    const res = await betterFetch(`${url}/wp-json/headless-wc/v1/products`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json.success === false) {
      return json;
    }
    return { success: true, data: json };
  } catch (error) {
    return {
      success: false,
      message: "Network or HTTP error occurred",
      error: "internal"
    };
  }
}

// src/api/getOrderDetails.ts
async function getOrderDetails(url, orderId, orderKey) {
  try {
    const res = await betterFetch(
      `${url}/wp-json/headless-wc/v1/order/${orderId}?key=${encodeURIComponent(
        orderKey
      )}`
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json.success === false) {
      return json;
    }
    return { success: true, data: json };
  } catch (error) {
    return {
      success: false,
      message: "Network or HTTP error occurred",
      error: "internal"
    };
  }
}

// src/HeadlessWC.ts
var HeadlessWC = class {
  url;
  cartInstancePromise = void 0;
  constructor(url) {
    this.url = url;
  }
  async createCart(items = [], customFields) {
    try {
      if (!this.cartInstancePromise) {
        this.cartInstancePromise = HWCCart.create(
          this.url,
          items,
          customFields
        );
      }
      return await this.cartInstancePromise;
    } catch (error) {
      return {
        success: false,
        message: "Failed to create cart",
        error: "internal"
      };
    }
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
  async getOrderDetails(orderId, orderKey) {
    return await getOrderDetails(this.url, orderId, orderKey);
  }
  async createOrder(items, props) {
    return await createOrder(this.url, {
      cartItems: items,
      ...props
    });
  }
  static selectProductVariation(product, attributeValues) {
    var _a;
    if (product.type !== "variable")
      throw new Error("Cannot select variation for non-variable product");
    const variation = (_a = product.variations.find(
      (variation2) => Object.entries(attributeValues).every(
        ([key, value]) => variation2.attributeValues[key] === value
      )
    )) == null ? void 0 : _a.variation;
    if (!variation) return product;
    return {
      ...product,
      isOnSale: variation.isOnSale,
      isVirtual: variation.isVirtual,
      isFeatured: variation.isFeatured,
      isSoldIndividually: variation.isSoldIndividually,
      image: variation.image,
      id: variation.id,
      name: variation.name,
      stockQuantity: variation.stockQuantity,
      stockStatus: variation.stockStatus,
      slug: variation.slug,
      permalink: variation.permalink,
      currency: variation.currency,
      price: variation.price,
      regularPrice: variation.regularPrice,
      salePrice: variation.salePrice,
      saleStartDatetime: variation.saleStartDatetime,
      saleEndDatetime: variation.saleEndDatetime,
      sku: variation.sku,
      globalUniqueId: variation.globalUniqueId,
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
