// import * as base from "./functions";

// async function getNextCache() {
//   try {
//     const mod: any = await import("next/cache");
//     return {
//       cacheLife: mod.unstable_cacheLife as ((life: string) => void) | undefined,
//       cacheTag: mod.unstable_cacheTag as
//         | ((...tags: string[]) => void)
//         | undefined,
//       revalidateTag: mod.revalidateTag as ((tag: string) => void) | undefined,
//     };
//   } catch {
//     return {
//       cacheLife: undefined,
//       cacheTag: undefined,
//       revalidateTag: undefined,
//     } as const;
//   }
// }

// export async function getProducts(params?: {
//   search?: string;
//   category?: string;
//   page?: number;
//   perPage?: number;
//   sort?: string;
//   order?: "asc" | "desc";
// }) {
//   "use cache";
//   const { cacheTag, cacheLife } = await getNextCache();
//   if (cacheTag) cacheTag("hwc:products");
//   if (cacheLife) cacheLife("days");
//   return base.getProducts(params);
// }

// export async function getProduct(idOrSlug: number | string) {
//   "use cache";
//   const { cacheTag, cacheLife } = await getNextCache();
//   if (cacheTag) cacheTag("hwc:products");
//   if (cacheLife) cacheLife("days");
//   return base.getProduct(idOrSlug);
// }

// export async function getProductById(id: number) {
//   "use cache";
//   const { cacheTag, cacheLife } = await getNextCache();
//   if (cacheTag) cacheTag("hwc:products");
//   if (cacheLife) cacheLife("days");
//   return base.getProduct(id);
// }

// export async function getProductBySlug(slug: string) {
//   "use cache";
//   const { cacheTag, cacheLife } = await getNextCache();
//   if (cacheTag) cacheTag("hwc:products");
//   if (cacheLife) cacheLife("days");
//   return base.getProduct(slug);
// }

// export const createCart = base.createCart;
// export const addToCart = base.addToCart;
// export const updateCartItem = base.updateCartItem;
// export const updateCart = base.updateCart;
// export const removeFromCart = base.removeFromCart;
// export const applyCoupon = base.applyCoupon;
// export const removeCoupon = base.removeCoupon;
// export const createOrder = base.createOrder;
// export const getOrderDetails = base.getOrderDetails;

// export async function revalidateProducts() {
//   const { revalidateTag } = await getNextCache();
//   if (revalidateTag) revalidateTag("hwc:products");
// }

// export async function revalidatePages() {
//   const { revalidateTag } = await getNextCache();
//   if (revalidateTag) revalidateTag("hwc:pages");
// }

// export async function revalidateNextjsCache() {
//   const { revalidateTag } = await getNextCache();
//   if (revalidateTag) {
//     revalidateTag("hwc:products");
//     revalidateTag("hwc:pages");
//   }
// }

// async function getNextCache() {
//   try {
//     const mod: any = await import("next/cache");
//     return {
//       cacheLife: mod.unstable_cacheLife as ((life: string) => void) | undefined,
//       cacheTag: mod.unstable_cacheTag as
//         | ((...tags: string[]) => void)
//         | undefined,
//       revalidateTag: mod.revalidateTag as ((tag: string) => void) | undefined,
//     };
//   } catch {
//     return {
//       cacheLife: undefined,
//       cacheTag: undefined,
//       revalidateTag: undefined,
//     } as const;
//   }
// }

// export async function getProducts(params?: {
//   search?: string;
//   category?: string;
//   page?: number;
//   perPage?: number;
//   sort?: string;
//   order?: "asc" | "desc";
// }) {
//   "use cache";
//   const { cacheTag, cacheLife } = await getNextCache();
//   if (cacheTag) cacheTag("hwc:products");
//   if (cacheLife) cacheLife("days");
//   return core.getProducts(params);
// }

// export async function getProduct(idOrSlug: number | string) {
//   "use cache";
//   const { cacheTag, cacheLife } = await getNextCache();
//   if (cacheTag) cacheTag("hwc:products");
//   if (cacheLife) cacheLife("days");
//   return core.getProduct(idOrSlug);
// }

// export async function getProductById(id: number) {
//   "use cache";
//   const { cacheTag, cacheLife } = await getNextCache();
//   if (cacheTag) cacheTag("hwc:products");
//   if (cacheLife) cacheLife("days");
//   return core.getProduct(id);
// }

// export async function getProductBySlug(slug: string) {
//   "use cache";
//   const { cacheTag, cacheLife } = await getNextCache();
//   if (cacheTag) cacheTag("hwc:products");
//   if (cacheLife) cacheLife("days");
//   return core.getProduct(slug);
// }

// export const createCart = core.createCart;
// export const addToCart = core.addToCart;
// export const updateCartItem = core.updateCartItem;
// export const updateCart = core.updateCart;
// export const removeFromCart = core.removeFromCart;
// export const applyCoupon = core.applyCoupon;
// export const removeCoupon = core.removeCoupon;
// export const createOrder = core.createOrder;
// export const getOrderDetails = core.getOrderDetails;

// export async function revalidateProducts() {
//   const { revalidateTag } = await getNextCache();
//   if (revalidateTag) revalidateTag("hwc:products");
// }

// export async function revalidatePages() {
//   const { revalidateTag } = await getNextCache();
//   if (revalidateTag) revalidateTag("hwc:pages");
// }

// export async function revalidateNextjsCache() {
//   const { revalidateTag } = await getNextCache();
//   if (revalidateTag) {
//     revalidateTag("hwc:products");
//     revalidateTag("hwc:pages");
//   }
// }
