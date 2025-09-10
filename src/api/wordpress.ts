import { getBaseUrl } from "@/core/config";
import type {
  WPProductCategory,
  WPProductTag,
  WPTaxonomyQuery,
  WPAuthor,
  WPCategory,
  WPFeaturedMedia,
  WPPage,
  WPPost,
  WPTag,
} from "../types/wordpress";

function getUrl(path: string, query?: Record<string, any>) {
  const url = new URL(path, getBaseUrl());
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

// Posts
export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
}): Promise<WPPost[]> {
  const full = getUrl("/wp-json/wp/v2/posts", {
    author: filterParams?.author,
    tags: filterParams?.tag,
    categories: filterParams?.category,
  });
  const response = await fetch(full);
  return (await response.json()) as WPPost[];
}

export async function getPostById(id: number): Promise<WPPost> {
  const full = getUrl(`/wp-json/wp/v2/posts/${id}`);
  const response = await fetch(full);
  return (await response.json()) as WPPost;
}

export async function getPostBySlug(slug: string): Promise<WPPost> {
  const full = getUrl("/wp-json/wp/v2/posts", { slug });
  const response = await fetch(full);
  const list = (await response.json()) as WPPost[];
  return list[0]!;
}

// Categories/Tags (posts)
export async function getAllCategories(): Promise<WPCategory[]> {
  const response = await fetch(getUrl("/wp-json/wp/v2/categories"));
  return (await response.json()) as WPCategory[];
}

export async function getCategoryById(id: number): Promise<WPCategory> {
  const response = await fetch(getUrl(`/wp-json/wp/v2/categories/${id}`));
  return (await response.json()) as WPCategory;
}

export async function getCategoryBySlug(slug: string): Promise<WPCategory> {
  const response = await fetch(getUrl("/wp-json/wp/v2/categories", { slug }));
  const list = (await response.json()) as WPCategory[];
  return list[0]!;
}

export async function getPostsByCategory(
  categoryId: number
): Promise<WPPost[]> {
  const response = await fetch(
    getUrl("/wp-json/wp/v2/posts", { categories: categoryId })
  );
  return (await response.json()) as WPPost[];
}

export async function getPostsByTag(tagId: number): Promise<WPPost[]> {
  const response = await fetch(getUrl("/wp-json/wp/v2/posts", { tags: tagId }));
  return (await response.json()) as WPPost[];
}

export async function getTagsByPost(postId: number): Promise<WPTag[]> {
  const response = await fetch(getUrl("/wp-json/wp/v2/tags", { post: postId }));
  return (await response.json()) as WPTag[];
}

export async function getAllTags(): Promise<WPTag[]> {
  const response = await fetch(getUrl("/wp-json/wp/v2/tags"));
  return (await response.json()) as WPTag[];
}

export async function getTagById(id: number): Promise<WPTag> {
  const response = await fetch(getUrl(`/wp-json/wp/v2/tags/${id}`));
  return (await response.json()) as WPTag;
}

export async function getTagBySlug(slug: string): Promise<WPTag> {
  const response = await fetch(getUrl("/wp-json/wp/v2/tags", { slug }));
  const list = (await response.json()) as WPTag[];
  return list[0]!;
}

// Pages
export async function getAllPages(): Promise<WPPage[]> {
  const response = await fetch(getUrl("/wp-json/wp/v2/pages"));
  return (await response.json()) as WPPage[];
}

export async function getPageById(id: number): Promise<WPPage> {
  const response = await fetch(getUrl(`/wp-json/wp/v2/pages/${id}`));
  return (await response.json()) as WPPage;
}

export async function getPageBySlug(slug: string): Promise<WPPage> {
  const response = await fetch(getUrl("/wp-json/wp/v2/pages", { slug }));
  const list = (await response.json()) as WPPage[];
  return list[0]!;
}

// Authors
export async function getAllAuthors(): Promise<WPAuthor[]> {
  const response = await fetch(getUrl("/wp-json/wp/v2/users"));
  return (await response.json()) as WPAuthor[];
}

export async function getAuthorById(id: number): Promise<WPAuthor> {
  const response = await fetch(getUrl(`/wp-json/wp/v2/users/${id}`));
  return (await response.json()) as WPAuthor;
}

export async function getAuthorBySlug(slug: string): Promise<WPAuthor> {
  const response = await fetch(getUrl("/wp-json/wp/v2/users", { slug }));
  const list = (await response.json()) as WPAuthor[];
  return list[0]!;
}

export async function getPostsByAuthor(authorId: number): Promise<WPPost[]> {
  const response = await fetch(
    getUrl("/wp-json/wp/v2/posts", { author: authorId })
  );
  return (await response.json()) as WPPost[];
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<WPPost[]> {
  const author = await getAuthorBySlug(authorSlug);
  const response = await fetch(
    getUrl("/wp-json/wp/v2/posts", { author: author.id })
  );
  return (await response.json()) as WPPost[];
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<WPPost[]> {
  const category = await getCategoryBySlug(categorySlug);
  const response = await fetch(
    getUrl("/wp-json/wp/v2/posts", { categories: category.id })
  );
  return (await response.json()) as WPPost[];
}

export async function getPostsByTagSlug(tagSlug: string): Promise<WPPost[]> {
  const tag = await getTagBySlug(tagSlug);
  const response = await fetch(
    getUrl("/wp-json/wp/v2/posts", { tags: tag.id })
  );
  return (await response.json()) as WPPost[];
}

// Media
export async function getFeaturedMediaById(
  url: string,
  id: number
): Promise<WPFeaturedMedia> {
  const response = await fetch(getUrl(`/wp-json/wp/v2/media/${id}`));
  return (await response.json()) as WPFeaturedMedia;
}

// Woo product taxonomies exposed via WP v2
function buildTaxonomyQuery(params?: WPTaxonomyQuery): string {
  if (!params) return "";
  const qs = new URLSearchParams();
  const pairs: Array<[string, string | undefined]> = [
    ["search", params.search],
    ["page", params.page !== undefined ? String(params.page) : undefined],
    [
      "per_page",
      params.perPage !== undefined ? String(params.perPage) : undefined,
    ],
    ["parent", params.parent !== undefined ? String(params.parent) : undefined],
    [
      "hide_empty",
      params.hideEmpty !== undefined ? String(params.hideEmpty) : undefined,
    ],
  ];
  for (const [k, v] of pairs) {
    if (v !== undefined) qs.set(k, v);
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export async function getProductCategories(
  params?: WPTaxonomyQuery
): Promise<WPProductCategory[]> {
  const res = await fetch(
    getUrl(`/wp-json/wp/v2/product_cat${buildTaxonomyQuery(params)}`)
  );
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = (await res.json()) as unknown;
  if (!Array.isArray(json)) throw new Error("Invalid response format");
  return json as WPProductCategory[];
}

export async function getProductTags(
  params?: WPTaxonomyQuery
): Promise<WPProductTag[]> {
  const res = await fetch(
    getUrl(`/wp-json/wp/v2/product_tag${buildTaxonomyQuery(params)}`)
  );
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = (await res.json()) as unknown;
  if (!Array.isArray(json)) throw new Error("Invalid response format");
  return json as WPProductTag[];
}

export async function getProductCategoryById(
  id: number
): Promise<WPProductCategory> {
  const res = await fetch(getUrl(`/wp-json/wp/v2/product_cat/${id}`));
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return (await res.json()) as WPProductCategory;
}

export async function getProductCategoryBySlug(
  slug: string
): Promise<WPProductCategory> {
  const res = await fetch(getUrl(`/wp-json/wp/v2/product_cat`, { slug }));
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const list = (await res.json()) as WPProductCategory[];
  return list[0]!;
}

export async function getProductTagById(id: number): Promise<WPProductTag> {
  const res = await fetch(getUrl(`/wp-json/wp/v2/product_tag/${id}`));
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return (await res.json()) as WPProductTag;
}

export async function getProductTagBySlug(slug: string): Promise<WPProductTag> {
  const res = await fetch(getUrl(`/wp-json/wp/v2/product_tag`, { slug }));
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const list = (await res.json()) as WPProductTag[];
  return list[0]!;
}
