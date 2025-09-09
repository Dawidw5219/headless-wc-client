// Shared term base and helpers (moved from taxonomy.ts)
export interface HWCTaxonomyTermBase {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number;
  count?: number;
  link?: string;
  meta?: any[];
}

export type WPTerm<TTaxonomy extends string> = HWCTaxonomyTermBase & {
  taxonomy: TTaxonomy;
};

export type HWCProductCategory = HWCTaxonomyTermBase & {
  taxonomy: "product_cat";
};

export type HWCProductTag = HWCTaxonomyTermBase & {
  taxonomy: "product_tag";
};

export interface HWCTaxonomyQuery {
  search?: string;
  page?: number;
  perPage?: number;
  parent?: number;
  hideEmpty?: boolean;
}

export type WPPost = {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  sticky: boolean;
  template: string;
  format:
    | "standard"
    | "aside"
    | "chat"
    | "gallery"
    | "link"
    | "image"
    | "quote"
    | "status"
    | "video"
    | "audio";
  meta: any[];
  categories: number[];
  tags: number[];
};

export type WPCategory = WPTerm<"category">;

export type WPTag = WPTerm<"post_tag">;

export type WPPage = {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  template: string;
  meta: any[];
};

export type WPAuthor = {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: { [key: string]: string };
  meta: any[];
};

export type WPFeaturedMedia = {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: { rendered: string };
  author: number;
  caption: { rendered: string };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
};
