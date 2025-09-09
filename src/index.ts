// Framework agnostic functions - work everywhere
export * from "./api/wordpress";
export * from "./core";

// Next.js specific functions - work everywhere but optimized for Next.js
// In non-Next.js environments these functions are still available but without cache
export {
  revalidateNextjsCache,
  revalidatePages,
  revalidateProducts,
} from "./next";

export type {
  HWCProductCategory,
  HWCProductTag,
  HWCTaxonomyQuery,
} from "./types/wordpress";
