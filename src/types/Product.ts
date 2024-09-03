import { HWCImage } from "./Image";
import { HWCAttribute } from "./Attribute";

type HWCProductBase = {
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
  quantity: number;
  total: number;
};

type HWCSimpleProduct = HWCProductBase & {
  type: "simple" | "grouped" | "external";
};

type HWCVariableProduct = HWCProductBase & {
  type: "variable";
  variations_min_price: number;
  variations_max_price: number;
};

export type HWCProductType = HWCSimpleProduct | HWCVariableProduct;

//////////////////////
// Detailed product //
//////////////////////

interface HWCProductDetailedBase extends HWCProductBase {
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
}

type HWCSimpleProductDetailed = HWCProductDetailedBase & {
  type: "simple" | "grouped" | "external";
};

type HWCVariableProductDetailed = HWCProductDetailedBase & {
  type: "variable";
  variations_min_price: number;
  variations_max_price: number;
  variations: {
    attribute_values: { [key: string]: string };
    variation: HWCVariation;
  }[];
};

export type HWCVariation = Omit<HWCProductBase, "short_description"> & {
  type: "variation";
  content?: {
    rendered: string;
    plain: string;
  };
};

export type HWCProductDetailed = HWCSimpleProductDetailed | HWCVariableProductDetailed;
