import { HWCImage } from "./Image";
import { HWCProductBase, HWCSimpleProduct, HWCVariation } from "./Product";

type HWCSimpleProductDetailed = HWCSimpleProduct & {
  type: "simple" | "grouped" | "external";
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
};

type HWCVariableProductDetailed = Omit<HWCSimpleProductDetailed, "type"> & {
  type: "variable";
  variation_id: number | null;
  variation: null;
  variations_min_price: number;
  variations_max_price: number;
  variations: {
    attribute_values: { [key: string]: string };
    variation: HWCVariation;
  }[];
};

export type HWCProductDetailed = HWCSimpleProductDetailed | HWCVariableProductDetailed;
