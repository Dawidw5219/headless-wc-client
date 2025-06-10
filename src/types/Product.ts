import { HWCAttribute } from "./Attribute";
import { HWCImage } from "./Image";

export type HWCProductBase = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  currency: string;
  price: number;
  regularPrice: number;
  salePrice?: number;
  image: HWCImage;
};

export type HWCSimpleProduct = HWCProductBase & {
  type: "simple" | "grouped" | "external";
  isOnSale: boolean;
  isVirtual: boolean;
  isFeatured: boolean;
  isSoldIndividually: boolean;
  stockQuantity?: number;
  stockStatus: "onbackorder" | "instock" | "outofstock";
  attributes: HWCAttribute[];
  categories: string[];
  tags: string[];
  saleStartDatetime?: string;
  saleEndDatetime?: string;
  sku?: string;
  globalUniqueId?: string;
  shortDescription?: {
    rendered: string;
    plain: string;
  };
};

export type HWCVariation = Omit<
  HWCSimpleProduct,
  "type" | "shortDescription"
> & {
  type: "variation";
  content?: {
    rendered: string;
    plain: string;
  };
};

export type HWCVariableProduct = Omit<HWCSimpleProduct, "type"> & {
  type: "variable";
  variationsMinPrice: number;
  variationsMaxPrice: number;
  variations: {
    attributeValues: { [key: string]: string };
    variation: HWCVariation;
  }[];
};

export type HWCProduct = HWCSimpleProduct | HWCVariableProduct;
