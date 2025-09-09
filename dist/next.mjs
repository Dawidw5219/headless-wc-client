// src/utils/better-fetch.ts
var APP_NAME = "HeadlessWC";
function isDevEnvironment() {
  if (typeof window !== "undefined") {
    const hostname = window.location?.hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname?.includes("localhost") || window.location?.port === "3000";
  }
  return process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "development" || !process.env.NODE_ENV;
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function withTimeout(promise, ms) {
  if (!ms) return promise;
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("Request timeout")), ms);
    promise.then((v) => {
      clearTimeout(id);
      resolve(v);
    }).catch((e) => {
      clearTimeout(id);
      reject(e);
    });
  });
}
function backoffDelay(attempt, base, max) {
  const exp = base * Math.pow(2, attempt);
  return Math.min(max, exp);
}
function shouldRetry(status, allowed) {
  return allowed.includes(status);
}
async function executeWithRetry(attempt, ctx) {
  const { retries, fetcher, onDelay, computeDelay, retryOnStatus } = ctx;
  try {
    const response = await fetcher();
    if (response.ok) return response;
    if (!shouldRetry(response.status, retryOnStatus) || attempt === retries) {
      return response;
    }
    const delay = computeDelay(attempt);
    onDelay(delay);
    await sleep(delay);
    return executeWithRetry(attempt + 1, ctx);
  } catch (err) {
    if (attempt === retries) throw err;
    const delay = computeDelay(attempt);
    onDelay(delay);
    await sleep(delay);
    return executeWithRetry(attempt + 1, ctx);
  }
}
async function betterFetch(url, options = {}) {
  const {
    retries = 3,
    retryBaseDelayMs = 300,
    retryMaxDelayMs = 3e3,
    timeoutMs = 1e4,
    retryOnStatus = [408, 429, 500, 502, 503, 504],
    ...fetchOptions
  } = options;
  const isDev = isDevEnvironment();
  if (!fetchOptions.cache) {
    fetchOptions.cache = isDev ? "no-store" : "default";
  }
  const computeDelay = (attempt) => backoffDelay(attempt, retryBaseDelayMs, retryMaxDelayMs);
  const response = await executeWithRetry(0, {
    retries,
    fetcher: () => withTimeout(fetch(url, fetchOptions), timeoutMs),
    onDelay: (ms) => {
      if (isDev) {
        console.error(`[${APP_NAME}] retry in ${ms}ms`);
      }
    },
    computeDelay,
    retryOnStatus
  });
  return response;
}

// src/api/woocommerce.ts
async function createCart(url, products, couponCode = "", customFields) {
  const res = await betterFetch(`${url}/wp-json/headless-wc/v1/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-cache",
    body: JSON.stringify({ cart: products, couponCode, customFields })
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  if (json.success === false) return json;
  return { success: true, data: json };
}
async function createOrder(url, props) {
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
  if (json.success === false) return json;
  return { success: true, data: json };
}
async function getOrderDetails(url, orderId, orderKey) {
  const res = await betterFetch(
    `${url}/wp-json/headless-wc/v1/order/${orderId}?key=${encodeURIComponent(
      orderKey
    )}`
  );
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  if (json.success === false) return json;
  return { success: true, data: json };
}
async function getProduct(url, idOrSlug) {
  const res = await betterFetch(
    `${url}/wp-json/headless-wc/v1/products/${idOrSlug}`
  );
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  if (json.success === false) return json;
  return { success: true, data: json };
}
function buildProductsUrl(url, params) {
  const base = `${url}/wp-json/headless-wc/v1/products`;
  if (!params) return base;
  const qs = new URLSearchParams();
  const pairs = [
    ["search", params.search],
    ["category", params.category],
    ["page", params.page !== void 0 ? String(params.page) : void 0],
    [
      "perPage",
      params.perPage !== void 0 ? String(params.perPage) : void 0
    ],
    ["sort", params.sort],
    ["order", params.order]
  ];
  for (const [k, v] of pairs) {
    if (v !== void 0) qs.set(k, v);
  }
  const s = qs.toString();
  return s ? `${base}?${s}` : base;
}
async function getProducts(url, params) {
  const res = await betterFetch(buildProductsUrl(url, params));
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  if (json.success === false) return json;
  const items = Array.isArray(json.data) ? json.data : [];
  return { success: true, data: items };
}

// src/core/config.ts
var BASE_URL;
function getBaseUrl() {
  if (BASE_URL) return BASE_URL;
  const fromEnv = process.env.WOOCOMMERCE_BASE_URL || process.env.PUBLIC_WOOCOMMERCE_BASE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_BASE_URL;
  if (fromEnv) return fromEnv;
  throw new Error(
    "WooCommerce base URL not set. Call setWooCommerceUrl(baseUrl) or provide WOOCOMMERCE_BASE_URL / PUBLIC_WOOCOMMERCE_BASE_URL / NEXT_PUBLIC_WOOCOMMERCE_BASE_URL."
  );
}

// src/core/add-to-cart.ts
async function addToCart(cartItems, input) {
  const url = getBaseUrl();
  const item = "id" in input ? { id: input.id, quantity: input.quantity ?? 1 } : { slug: input.slug, quantity: input.quantity ?? 1 };
  const res = await createCart(
    url,
    [...cartItems, item],
    "",
    void 0
  );
  if (res.success === false) {
    throw new Error(res.message);
  }
  return res.data;
}

// src/core/apply-coupon.ts
async function applyCoupon(cartItems, code) {
  const url = getBaseUrl();
  const res = await createCart(
    url,
    cartItems,
    code,
    void 0
  );
  if (res.success === false) throw new Error(res.message);
  return res.data;
}
async function removeCoupon(cartItems) {
  return applyCoupon(cartItems, "");
}

// src/core/create-order.ts
async function createOrder2(args) {
  const url = getBaseUrl();
  const res = await createOrder(url, args);
  if (res.success === false) {
    throw new Error(res.message);
  }
  return res.data;
}

// src/core/get-cart.ts
async function getCart(cartItems) {
  const url = getBaseUrl();
  const res = await createCart(
    url,
    cartItems,
    "",
    void 0
  );
  if (res.success === false) {
    throw new Error(res.message);
  }
  return res.data;
}
var createCart2 = getCart;

// src/core/get-order-details.ts
async function getOrderDetails2(orderId, orderKey) {
  const url = getBaseUrl();
  const res = await getOrderDetails(
    url,
    orderId,
    orderKey
  );
  if (res.success === false) {
    throw new Error(res.message);
  }
  return res.data;
}

// src/core/get-product.ts
async function getProduct2(idOrSlug) {
  const url = getBaseUrl();
  const res = await getProduct(
    url,
    idOrSlug
  );
  if (res.success === false) {
    throw new Error(res.message);
  }
  return res.data;
}

// src/core/get-products.ts
async function getProducts2(params) {
  const url = getBaseUrl();
  const res = await getProducts(url, params);
  if (res.success === false) {
    throw new Error(res.message);
  }
  return res.data;
}

// src/core/remove-from-cart.ts
async function removeFromCart(cartItems, idOrSlug) {
  const url = getBaseUrl();
  const next = cartItems.filter((item) => {
    if (typeof idOrSlug === "number") {
      return !("id" in item && item.id === idOrSlug);
    }
    return !("slug" in item && item.slug === idOrSlug);
  });
  const res = await createCart(
    url,
    next,
    "",
    void 0
  );
  if (res.success === false) throw new Error(res.message);
  return res.data;
}

// src/core/update-cart.ts
async function updateCart(cartItems, changes) {
  const url = getBaseUrl();
  const byId = /* @__PURE__ */ new Map();
  const bySlug = /* @__PURE__ */ new Map();
  for (const c of changes) {
    if ("id" in c) byId.set(c.id, c.quantity);
    else bySlug.set(c.slug, c.quantity);
  }
  const next = cartItems.map((item) => {
    if ("id" in item) {
      const q2 = byId.get(item.id) ?? item.quantity;
      return { id: item.id, quantity: q2 };
    }
    const q = bySlug.get(item.slug) ?? item.quantity;
    return { slug: item.slug, quantity: q };
  });
  const res = await createCart(
    url,
    next,
    "",
    void 0
  );
  if (res.success === false) throw new Error(res.message);
  return res.data;
}

// src/core/update-cart-item.ts
async function updateCartItem(cartItems, change) {
  const url = getBaseUrl();
  const next = cartItems.map((item) => {
    if ("id" in item && change.id !== void 0 && item.id === change.id) {
      return { id: item.id, quantity: change.quantity };
    }
    if ("slug" in item && change.slug !== void 0 && item.slug === change.slug) {
      return { slug: item.slug, quantity: change.quantity };
    }
    return item;
  });
  const res = await createCart(
    url,
    next,
    "",
    void 0
  );
  if (res.success === false) throw new Error(res.message);
  return res.data;
}

// src/next/index.ts
async function getNextCache() {
  try {
    const mod = await import("next/cache");
    return {
      cacheLife: mod.unstable_cacheLife,
      cacheTag: mod.unstable_cacheTag,
      revalidateTag: mod.revalidateTag
    };
  } catch {
    return {
      cacheLife: void 0,
      cacheTag: void 0,
      revalidateTag: void 0
    };
  }
}
async function getProducts3(params) {
  "use cache";
  const { cacheTag, cacheLife } = await getNextCache();
  if (cacheTag) cacheTag("hwc:products");
  if (cacheLife) cacheLife("days");
  return getProducts2(params);
}
async function getProduct3(idOrSlug) {
  "use cache";
  const { cacheTag, cacheLife } = await getNextCache();
  if (cacheTag) cacheTag("hwc:products");
  if (cacheLife) cacheLife("days");
  return getProduct2(idOrSlug);
}
async function getProductById(id) {
  "use cache";
  const { cacheTag, cacheLife } = await getNextCache();
  if (cacheTag) cacheTag("hwc:products");
  if (cacheLife) cacheLife("days");
  return getProduct2(id);
}
async function getProductBySlug(slug) {
  "use cache";
  const { cacheTag, cacheLife } = await getNextCache();
  if (cacheTag) cacheTag("hwc:products");
  if (cacheLife) cacheLife("days");
  return getProduct2(slug);
}
var createCart3 = createCart2;
var addToCart2 = addToCart;
var updateCartItem2 = updateCartItem;
var updateCart2 = updateCart;
var removeFromCart2 = removeFromCart;
var applyCoupon2 = applyCoupon;
var removeCoupon2 = removeCoupon;
var createOrder3 = createOrder2;
var getOrderDetails3 = getOrderDetails2;
async function revalidateProducts() {
  const { revalidateTag } = await getNextCache();
  if (revalidateTag) revalidateTag("hwc:products");
}
async function revalidatePages() {
  const { revalidateTag } = await getNextCache();
  if (revalidateTag) revalidateTag("hwc:pages");
}
async function revalidateNextjsCache() {
  const { revalidateTag } = await getNextCache();
  if (revalidateTag) {
    revalidateTag("hwc:products");
    revalidateTag("hwc:pages");
  }
}
export {
  addToCart2 as addToCart,
  applyCoupon2 as applyCoupon,
  createCart3 as createCart,
  createOrder3 as createOrder,
  getOrderDetails3 as getOrderDetails,
  getProduct3 as getProduct,
  getProductById,
  getProductBySlug,
  getProducts3 as getProducts,
  removeCoupon2 as removeCoupon,
  removeFromCart2 as removeFromCart,
  revalidateNextjsCache,
  revalidatePages,
  revalidateProducts,
  updateCart2 as updateCart,
  updateCartItem2 as updateCartItem
};
