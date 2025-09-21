export * from "./api/wordpress";

export { addToCart } from "./functions/add-to-cart";
export { applyCoupon, removeCoupon } from "./functions/apply-coupon";
export { getBaseUrl, setWooCommerceUrl } from "./functions/config";
export { createOrder } from "./functions/create-order";
export { createCart, getCart } from "./functions/get-cart";
export { getOrderDetails } from "./functions/get-order-details";
export {
  getProduct,
  getProductById,
  getProductBySlug,
} from "./functions/get-product";
export { getProducts } from "./functions/get-products";
export { removeFromCart } from "./functions/remove-from-cart";
export { revalidateCart } from "./functions/revalidate-cart";
export { updateCart } from "./functions/update-cart";
export { updateCartItem } from "./functions/update-cart-item";
export {
  getInitialSelection,
  getVariantMatch,
} from "./functions/variants-getters";
export { normalizeSelection } from "./functions/variants-normalize-selection";
export { getAvailableOptions } from "./functions/variants-options";
export {
  changeVariant,
  getVariantState,
  updateSelection,
} from "./functions/variants-update";

export type { HWCCart } from "./types/cart";
export type { HWCCartItem } from "./types/cart-product";
export type { HWCCustomerData } from "./types/customer-data";
export type { HWCOrder } from "./types/order";
export type { HWCOrderDetails } from "./types/order-details";
export type { HWCProduct } from "./types/product";
export type { HWCProductDetailed } from "./types/product-detailed";
export type { HWCError, HWCResp } from "./types/response";

export type {
  WPProductCategory,
  WPProductTag,
  WPTaxonomyQuery,
  WPTerm,
  WPAuthor,
  WPFeaturedMedia,
  WPPage,
  WPPost,
  WPTag,
  WPCategory,
} from "./types/wordpress";
