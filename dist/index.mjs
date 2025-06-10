// src/utils/fetchWithRetry.ts
function isDevEnvironment() {
  return process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
}
async function betterFetch(url, options = {}) {
  const { retries = 3, retryDelay = 1e3, ...fetchOptions } = options;
  const isDev = isDevEnvironment();
  let lastError;
  let lastResponse;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);
      lastResponse = response;
      if (response.ok) {
        return response;
      }
      let responseText = "";
      let responseJson = null;
      try {
        const responseClone = response.clone();
        responseText = await responseClone.text();
        if (responseText) {
          try {
            responseJson = JSON.parse(responseText);
          } catch {
          }
        }
      } catch {
        responseText = "[Could not read response body]";
      }
      const errorDetails = {
        url,
        method: fetchOptions.method || "GET",
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        responseBody: responseJson || responseText,
        attempt,
        maxRetries: retries
      };
      if (isDev) {
        console.error("\u{1F6A8} HTTP Request Failed:", errorDetails);
      }
      lastError = new Error(`HTTP error! status: ${response.status}`);
      if (attempt === retries) {
        return response;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (isDev) {
        console.error("\u{1F6A8} Network/Fetch Error:", {
          url,
          method: fetchOptions.method || "GET",
          error: lastError.message,
          attempt,
          maxRetries: retries
        });
      }
      if (attempt === retries) {
        throw lastError;
      }
    }
    if (attempt < retries) {
      if (isDev) {
        console.warn(
          `\u23F3 Retrying request in ${retryDelay}ms... (attempt ${attempt + 1}/${retries})`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
  throw lastError;
}
function getBetterFetchOptions(customOptions = {}) {
  const isDevEnv = isDevEnvironment();
  return {
    cache: isDevEnv ? "no-store" : "default",
    retries: 3,
    retryDelay: 500,
    ...customOptions
  };
}

// src/api/createCart.ts
async function createCart(url, products, couponCode = "", customFields) {
  try {
    const res = await betterFetch(
      `${url}/wp-json/headless-wc/v1/cart`,
      getBetterFetchOptions({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
        body: JSON.stringify({ cart: products, couponCode, customFields })
      })
    );
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
async function createOrder(url, props) {
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
          customFields: props.customFields
        })
      })
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json["success"] != true) throw new Error();
    return json;
  } catch (error) {
    console.error(error);
    throw new Error(
      "Invalid response from WooCommerce Server. Couldn't create an order"
    );
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
    const { total, ...rest } = cart;
    return new _HWCCart({ ...cart, url });
  }
  async revalidateWithServer() {
    const fetchCart = await createCart(
      this.url,
      this.cartItems,
      this.couponCode,
      this.customFields
    );
    return new _HWCCart({ url: this.url, ...fetchCart });
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
    return new _HWCCart({ url: this.url, ...fetchCart });
  }
  async addProductBySlug(cartItem) {
    const fetchCart = await createCart(
      this.url,
      [...this.cartItems, cartItem],
      this.couponCode,
      this.customFields
    );
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
    const fetchCart = await createCart(
      this.url,
      newCartItems,
      this.couponCode,
      this.customFields
    );
    return new _HWCCart({ url: this.url, ...fetchCart });
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
    const newCart = new _HWCCart({ url: this.url, ...fetchCart });
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
    return new _HWCCart({ url: this.url, ...fetchCart });
  }
  async submitOrder(props) {
    const mergedCustomFields = {
      ...this.customFields,
      ...props.customFields
    };
    return await createOrder(this.url, {
      cartItems: this.cartItems,
      couponCode: this.couponCode,
      ...props,
      customFields: mergedCustomFields
    });
  }
};

// src/api/getProduct.ts
async function getProduct(url, idOrSlug) {
  try {
    const res = await betterFetch(
      `${url}/wp-json/headless-wc/v1/products/${idOrSlug}`,
      getBetterFetchOptions()
    );
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
    const res = await betterFetch(
      `${url}/wp-json/headless-wc/v1/products`,
      getBetterFetchOptions()
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json["success"] != true) throw new Error();
    return json.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// src/api/getOrderDetails.ts
async function getOrderDetails(url, orderId, orderKey) {
  try {
    const res = await betterFetch(
      `${url}/wp-json/headless-wc/v1/order/${orderId}?key=${encodeURIComponent(
        orderKey
      )}`,
      getBetterFetchOptions()
    );
    if (!res.ok) {
      if (res.status === 400) {
        throw new Error("Bad request - Missing order ID or order key");
      } else if (res.status === 403) {
        throw new Error("Forbidden - Invalid order key");
      } else if (res.status === 404) {
        throw new Error("Not found - Order does not exist");
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    if (json["success"] !== true)
      throw new Error("Invalid response from server");
    return json;
  } catch (error) {
    console.error("Error fetching order details:", error);
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
  async createCart(items = [], customFields) {
    if (!this.cartInstancePromise) {
      this.cartInstancePromise = HWCCart.create(this.url, items, customFields);
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
export {
  HWCCart,
  HeadlessWC,
  src_default as default
};
