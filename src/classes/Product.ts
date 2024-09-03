import { HWCAttribute } from "../types/Attribute";
import { HWCImage } from "../types/Image";
import { HWCProductDetailed, HWCVariation } from "../types/Product";

export class HWCProduct {
  type: "simple" | "variable" | "grouped" | "external";
  weight_unit: string;
  dimension_unit: string;
  height?: number;
  length?: number;
  weight?: number;
  width?: number;
  gallery_images: HWCImage[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  content?: {
    rendered: string;
    plain: string;
  };
  is_on_sale: boolean;
  is_virtual: boolean;
  is_featured: boolean;
  is_sold_individually: boolean;
  image: HWCImage;
  id: number;
  name: string;
  stock_quantity?: number;
  stock_status: "onbackorder" | "instock" | "outofstock";
  slug: string;
  permalink: string;
  currency: string;
  price: number;
  regular_price: number;
  attributes: HWCAttribute[];
  categories: string[];
  tags: string[];
  sale_price?: number;
  sale_start_datetime?: string;
  sale_end_datetime?: string;
  sku?: string;
  global_unique_id?: string;
  short_description?: {
    rendered: string;
    plain: string;
  };
  variations_min_price?: number;
  variations_max_price?: number;
  variations?: {
    attribute_values: { [key: string]: string };
    variation: HWCVariation;
  }[];

  constructor(props: {
    weight_unit: string;
    dimension_unit: string;
    height?: number;
    length?: number;
    weight?: number;
    width?: number;
    gallery_images: HWCImage[];
    upsell_ids: number[];
    content?: {
      rendered: string;
      plain: string;
    };
    is_on_sale: boolean;
    is_virtual: boolean;
    is_featured: boolean;
    is_sold_individually: boolean;
    image: HWCImage;
    id: number;
    name: string;
    stock_quantity?: number;
    stock_status: "onbackorder" | "instock" | "outofstock";
    slug: string;
    permalink: string;
    currency: string;
    price: number;
    regular_price: number;
    attributes: HWCAttribute[];
    categories: string[];
    tags: string[];
    sale_price?: number;
    sale_start_datetime?: string;
    sale_end_datetime?: string;
    sku?: string;
    global_unique_id?: string;
    short_description?: {
      rendered: string;
      plain: string;
    };
    variations_min_price?: number;
    variations_max_price?: number;
    variations?: {
      attribute_values: { [key: string]: string };
      variation: HWCVariation;
    }[];
  }) {
    Object.assign(this, props);
  }

  toJSON(): string {
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
      variations: this.variations,
    });
  }

  private cloneWithUpdates(updates: Partial<HWCProduct>): HWCProduct {
    return new HWCProduct({
      ...(this as any),
      ...updates,
    });
  }

  updateVariation(attributeValues: { [key: string]: string }): HWCProduct {
    const variation = this.variations!.find((variation) =>
      Object.entries(attributeValues).every(([key, value]) => variation.attribute_values[key] === value)
    )?.variation;
    if (!variation) return this;

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
      content: variation.content,
    });
  }
}
