"use strict";
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
  addToCart: () => addToCart,
  applyCoupon: () => applyCoupon,
  changeVariant: () => changeVariant,
  createCart: () => createCart2,
  createOrder: () => createOrder2,
  createUser: () => createUser2,
  getAllAuthors: () => getAllAuthors,
  getAllCategories: () => getAllCategories,
  getAllPages: () => getAllPages,
  getAllPosts: () => getAllPosts,
  getAllTags: () => getAllTags,
  getAuthorById: () => getAuthorById,
  getAuthorBySlug: () => getAuthorBySlug,
  getAvailableOptions: () => getAvailableOptions,
  getBaseUrl: () => getBaseUrl,
  getCart: () => getCart,
  getCategoryById: () => getCategoryById,
  getCategoryBySlug: () => getCategoryBySlug,
  getFeaturedMediaById: () => getFeaturedMediaById,
  getInitialSelection: () => getInitialSelection,
  getOrderDetails: () => getOrderDetails2,
  getPageById: () => getPageById,
  getPageBySlug: () => getPageBySlug,
  getPostById: () => getPostById,
  getPostBySlug: () => getPostBySlug,
  getPostsByAuthor: () => getPostsByAuthor,
  getPostsByAuthorSlug: () => getPostsByAuthorSlug,
  getPostsByCategory: () => getPostsByCategory,
  getPostsByCategorySlug: () => getPostsByCategorySlug,
  getPostsByTag: () => getPostsByTag,
  getPostsByTagSlug: () => getPostsByTagSlug,
  getProduct: () => getProduct2,
  getProductById: () => getProductById,
  getProductBySlug: () => getProductBySlug,
  getProductCategories: () => getProductCategories,
  getProductCategoryById: () => getProductCategoryById,
  getProductCategoryBySlug: () => getProductCategoryBySlug,
  getProductTagById: () => getProductTagById,
  getProductTagBySlug: () => getProductTagBySlug,
  getProductTags: () => getProductTags,
  getProducts: () => getProducts2,
  getTagById: () => getTagById,
  getTagBySlug: () => getTagBySlug,
  getTagsByPost: () => getTagsByPost,
  getVariantMatch: () => getVariantMatch,
  getVariantState: () => getVariantState,
  normalizeSelection: () => normalizeSelection,
  removeCoupon: () => removeCoupon,
  removeFromCart: () => removeFromCart,
  revalidateCart: () => revalidateCart,
  setWooCommerceUrl: () => setWooCommerceUrl,
  updateCart: () => updateCart,
  updateCartItem: () => updateCartItem,
  updateSelection: () => updateSelection
});
module.exports = __toCommonJS(src_exports);

// src/functions/config.ts
var BASE_URL;
function setWooCommerceUrl(baseUrl) {
  BASE_URL = baseUrl;
}
function getBaseUrl() {
  if (BASE_URL) return BASE_URL;
  const fromEnv = process.env.WOOCOMMERCE_BASE_URL || process.env.PUBLIC_WOOCOMMERCE_BASE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_BASE_URL;
  if (fromEnv) return fromEnv;
  throw new Error(
    "WooCommerce base URL not set. Call setWooCommerceUrl(baseUrl) or provide WOOCOMMERCE_BASE_URL / PUBLIC_WOOCOMMERCE_BASE_URL / NEXT_PUBLIC_WOOCOMMERCE_BASE_URL."
  );
}

// src/api/wordpress.ts
function getUrl(path, query) {
  const url = new URL(path, getBaseUrl());
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== void 0 && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}
async function getAllPosts(filterParams) {
  const full = getUrl("/wp-json/wp/v2/posts", {
    author: filterParams?.author,
    tags: filterParams?.tag,
    categories: filterParams?.category
  });
  const response = await fetch(full);
  return await response.json();
}
async function getPostById(id) {
  const full = getUrl(`/wp-json/wp/v2/posts/${id}`);
  const response = await fetch(full);
  return await response.json();
}
async function getPostBySlug(slug) {
  const full = getUrl("/wp-json/wp/v2/posts", { slug });
  const response = await fetch(full);
  const list = await response.json();
  return list[0];
}
async function getAllCategories() {
  const response = await fetch(getUrl("/wp-json/wp/v2/categories"));
  return await response.json();
}
async function getCategoryById(id) {
  const response = await fetch(getUrl(`/wp-json/wp/v2/categories/${id}`));
  return await response.json();
}
async function getCategoryBySlug(slug) {
  const response = await fetch(getUrl("/wp-json/wp/v2/categories", { slug }));
  const list = await response.json();
  return list[0];
}
async function getPostsByCategory(categoryId) {
  const response = await fetch(
    getUrl("/wp-json/wp/v2/posts", { categories: categoryId })
  );
  return await response.json();
}
async function getPostsByTag(tagId) {
  const response = await fetch(getUrl("/wp-json/wp/v2/posts", { tags: tagId }));
  return await response.json();
}
async function getTagsByPost(postId) {
  const response = await fetch(getUrl("/wp-json/wp/v2/tags", { post: postId }));
  return await response.json();
}
async function getAllTags() {
  const response = await fetch(getUrl("/wp-json/wp/v2/tags"));
  return await response.json();
}
async function getTagById(id) {
  const response = await fetch(getUrl(`/wp-json/wp/v2/tags/${id}`));
  return await response.json();
}
async function getTagBySlug(slug) {
  const response = await fetch(getUrl("/wp-json/wp/v2/tags", { slug }));
  const list = await response.json();
  return list[0];
}
async function getAllPages() {
  const response = await fetch(getUrl("/wp-json/wp/v2/pages"));
  return await response.json();
}
async function getPageById(id) {
  const response = await fetch(getUrl(`/wp-json/wp/v2/pages/${id}`));
  return await response.json();
}
async function getPageBySlug(slug) {
  const response = await fetch(getUrl("/wp-json/wp/v2/pages", { slug }));
  const list = await response.json();
  return list[0];
}
async function getAllAuthors() {
  const response = await fetch(getUrl("/wp-json/wp/v2/users"));
  return await response.json();
}
async function getAuthorById(id) {
  const response = await fetch(getUrl(`/wp-json/wp/v2/users/${id}`));
  return await response.json();
}
async function getAuthorBySlug(slug) {
  const response = await fetch(getUrl("/wp-json/wp/v2/users", { slug }));
  const list = await response.json();
  return list[0];
}
async function getPostsByAuthor(authorId) {
  const response = await fetch(
    getUrl("/wp-json/wp/v2/posts", { author: authorId })
  );
  return await response.json();
}
async function getPostsByAuthorSlug(authorSlug) {
  const author = await getAuthorBySlug(authorSlug);
  const response = await fetch(
    getUrl("/wp-json/wp/v2/posts", { author: author.id })
  );
  return await response.json();
}
async function getPostsByCategorySlug(categorySlug) {
  const category = await getCategoryBySlug(categorySlug);
  const response = await fetch(
    getUrl("/wp-json/wp/v2/posts", { categories: category.id })
  );
  return await response.json();
}
async function getPostsByTagSlug(tagSlug) {
  const tag = await getTagBySlug(tagSlug);
  const response = await fetch(
    getUrl("/wp-json/wp/v2/posts", { tags: tag.id })
  );
  return await response.json();
}
async function getFeaturedMediaById(url, id) {
  const response = await fetch(getUrl(`/wp-json/wp/v2/media/${id}`));
  return await response.json();
}
function buildTaxonomyQuery(params) {
  if (!params) return "";
  const qs = new URLSearchParams();
  const pairs = [
    ["search", params.search],
    ["page", params.page !== void 0 ? String(params.page) : void 0],
    [
      "per_page",
      params.perPage !== void 0 ? String(params.perPage) : void 0
    ],
    ["parent", params.parent !== void 0 ? String(params.parent) : void 0],
    [
      "hide_empty",
      params.hideEmpty !== void 0 ? String(params.hideEmpty) : void 0
    ]
  ];
  for (const [k, v] of pairs) {
    if (v !== void 0) qs.set(k, v);
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}
async function getProductCategories(params) {
  const res = await fetch(
    getUrl(`/wp-json/wp/v2/product_cat${buildTaxonomyQuery(params)}`)
  );
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json)) throw new Error("Invalid response format");
  return json;
}
async function getProductTags(params) {
  const res = await fetch(
    getUrl(`/wp-json/wp/v2/product_tag${buildTaxonomyQuery(params)}`)
  );
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json)) throw new Error("Invalid response format");
  return json;
}
async function getProductCategoryById(id) {
  const res = await fetch(getUrl(`/wp-json/wp/v2/product_cat/${id}`));
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}
async function getProductCategoryBySlug(slug) {
  const res = await fetch(getUrl(`/wp-json/wp/v2/product_cat`, { slug }));
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const list = await res.json();
  return list[0];
}
async function getProductTagById(id) {
  const res = await fetch(getUrl(`/wp-json/wp/v2/product_tag/${id}`));
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}
async function getProductTagBySlug(slug) {
  const res = await fetch(getUrl(`/wp-json/wp/v2/product_tag`, { slug }));
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const list = await res.json();
  return list[0];
}

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
    body: JSON.stringify(
      (() => {
        const payload = {
          cart: props.cartItems,
          couponCode: props.couponCode ?? "",
          shippingMethodId: props.shippingMethodId,
          paymentMethodId: props.paymentMethodId,
          redirectUrl: props.redirectURL ?? "",
          useDifferentShipping: Boolean(props.shipping),
          billing: props.billing,
          meta: props.meta
        };
        if (props.shipping) payload.shipping = props.shipping;
        return payload;
      })()
    )
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
async function createUser(url, userData) {
  const res = await betterFetch(`${url}/wp-json/headless-wc/v1/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      (() => {
        const payload = { ...userData };
        if (!userData.shipping) delete payload.shipping;
        return payload;
      })()
    )
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  if (json.success === false) return json;
  return { success: true, data: json };
}

// src/functions/add-to-cart.ts
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

// src/functions/apply-coupon.ts
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

// src/functions/create-order.ts
async function createOrder2(args) {
  const url = getBaseUrl();
  const res = await createOrder(url, args);
  if (res.success === false) {
    throw new Error(res.message);
  }
  return res.data;
}

// src/functions/create-user.ts
async function createUser2(userData) {
  const url = getBaseUrl();
  const res = await createUser(
    url,
    userData
  );
  if (res.success === false) {
    throw new Error(res.message);
  }
  return res.data;
}

// src/functions/get-cart.ts
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

// src/functions/get-order-details.ts
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

// src/functions/get-product.ts
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
async function getProductById(id) {
  return getProduct2(id);
}
async function getProductBySlug(slug) {
  return getProduct2(slug);
}

// src/functions/get-products.ts
async function getProducts2(params) {
  const url = getBaseUrl();
  const res = await getProducts(url, params);
  if (res.success === false) {
    throw new Error(res.message);
  }
  return res.data;
}

// src/functions/remove-from-cart.ts
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

// src/functions/revalidate-cart.ts
async function revalidateCart(cartItems) {
  const url = getBaseUrl();
  const res = await createCart(
    url,
    cartItems,
    "",
    void 0
  );
  if (res.success === false) throw new Error(res.message);
  return res.data;
}

// src/functions/update-cart.ts
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

// src/functions/update-cart-item.ts
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

// src/functions/variants-normalize-selection.ts
function canonicalizeKey(key) {
  return key.trim().toLowerCase();
}
function buildAttributeKeyMap(attributes) {
  const map = {};
  for (const attr of attributes) {
    map[canonicalizeKey(attr.name)] = attr.name;
  }
  return map;
}
function normalizeSelection(product, selection) {
  if (product.type !== "variable") return {};
  const keyMap = buildAttributeKeyMap(product.attributes);
  const normalized = {};
  for (const [k, v] of Object.entries(selection)) {
    const canonical = canonicalizeKey(k);
    const original = keyMap[canonical] ?? k;
    normalized[original] = v;
  }
  return normalized;
}

// src/functions/variants-getters.ts
function getVariantMatch(product, selection) {
  if (product.type !== "variable") return null;
  const normalized = normalizeSelection(product, selection);
  const match = product.variations.find(
    (v) => Object.entries(normalized).every(
      ([name, value]) => v.attributeValues[name] === value
    )
  );
  return match?.variation ?? null;
}
function getInitialSelection(product) {
  if (product.type !== "variable") return {};
  if (product.variationId) {
    const found = product.variations.find(
      (v) => v.variation.id === product.variationId
    );
    if (found) return { ...found.attributeValues };
  }
  return {
    ...product.variations[0]?.attributeValues ?? {}
  };
}

// src/functions/variants-options.ts
function getAvailableOptions(product, partialSelection) {
  if (product.type !== "variable") return {};
  const normalized = normalizeSelection(product, partialSelection);
  const result = {};
  for (const attr of product.attributes) {
    const name = attr.name;
    const values = attr.values.map((v) => v.name);
    const options = values.map((value) => {
      const candidate = { ...normalized, [name]: value };
      const available = product.variations.some(
        (v) => Object.entries(candidate).every(
          ([n, val]) => v.attributeValues[n] === val
        )
      );
      const selected = normalized[name] === value;
      return { value, available, selected };
    });
    result[name] = options;
  }
  return result;
}

// src/functions/variants-update.ts
function updateSelection(product, currentSelection, changedName, changedValue) {
  if (product.type !== "variable") {
    return {
      selection: {},
      variation: null,
      productView: product
    };
  }
  const normalized = normalizeSelection(product, currentSelection);
  const selection = {
    ...normalized,
    [changedName]: changedValue
  };
  const variation = getVariantMatch(product, selection);
  if (!variation) {
    return { selection, variation: null, productView: product };
  }
  const productView = {
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
    content: variation.content,
    variationId: variation.id
  };
  return { selection, variation, productView };
}
function getVariantState(product, selection) {
  if (product.type !== "variable") {
    return {
      selection: {},
      variation: null,
      productView: product,
      options: {}
    };
  }
  const effective = selection && Object.keys(selection).length > 0 ? normalizeSelection(product, selection) : product.variations[0]?.attributeValues ?? {};
  const variation = getVariantMatch(product, effective);
  const options = getAvailableOptions(product, effective);
  return {
    selection: effective,
    variation,
    productView: product,
    options
  };
}
function changeVariant(product, state, name, value) {
  if (product.type !== "variable") {
    return {
      selection: {},
      variation: null,
      productView: product,
      options: {}
    };
  }
  const { selection, variation, productView } = updateSelection(
    product,
    state.selection,
    name,
    value
  );
  const options = getAvailableOptions(product, selection);
  return { selection, variation, productView, options };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addToCart,
  applyCoupon,
  changeVariant,
  createCart,
  createOrder,
  createUser,
  getAllAuthors,
  getAllCategories,
  getAllPages,
  getAllPosts,
  getAllTags,
  getAuthorById,
  getAuthorBySlug,
  getAvailableOptions,
  getBaseUrl,
  getCart,
  getCategoryById,
  getCategoryBySlug,
  getFeaturedMediaById,
  getInitialSelection,
  getOrderDetails,
  getPageById,
  getPageBySlug,
  getPostById,
  getPostBySlug,
  getPostsByAuthor,
  getPostsByAuthorSlug,
  getPostsByCategory,
  getPostsByCategorySlug,
  getPostsByTag,
  getPostsByTagSlug,
  getProduct,
  getProductById,
  getProductBySlug,
  getProductCategories,
  getProductCategoryById,
  getProductCategoryBySlug,
  getProductTagById,
  getProductTagBySlug,
  getProductTags,
  getProducts,
  getTagById,
  getTagBySlug,
  getTagsByPost,
  getVariantMatch,
  getVariantState,
  normalizeSelection,
  removeCoupon,
  removeFromCart,
  revalidateCart,
  setWooCommerceUrl,
  updateCart,
  updateCartItem,
  updateSelection
});
