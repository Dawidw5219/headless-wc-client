import { HWCAttribute } from "./Attribute";
import { HWCImage } from "./Image";

export type HWCProductBase = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  currency: string;
  price: number;
  regular_price: number;
  sale_price?: number;
  image: HWCImage;
};

export type HWCSimpleProduct = HWCProductBase & {
  type: "simple" | "grouped" | "external";
  is_on_sale: boolean;
  is_virtual: boolean;
  is_featured: boolean;
  is_sold_individually: boolean;
  stock_quantity?: number;
  stock_status: "onbackorder" | "instock" | "outofstock";
  attributes: HWCAttribute[];
  categories: string[];
  tags: string[];
  sale_start_datetime?: string;
  sale_end_datetime?: string;
  sku?: string;
  global_unique_id?: string;
  short_description?: {
    rendered: string;
    plain: string;
  };
};



export type HWCVariation = Omit<HWCSimpleProduct, "type" | "short_description"> & {
  type: "variation";
  content?: {
    rendered: string;
    plain: string;
  };
};

export type HWCVariableProduct = Omit<HWCSimpleProduct, "type"> & {
  type: "variable";
  variations_min_price: number;
  variations_max_price: number;
  variations: {
    attribute_values: { [key: string]: string };
    variation: HWCVariation;
  }[];
};

export type HWCProduct = HWCSimpleProduct | HWCVariableProduct;
