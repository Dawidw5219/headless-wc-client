import type { HWCImage } from "./image";
import type { HWCSimpleProduct, HWCVariation } from "./product";

type HWCSimpleProductDetailed = HWCSimpleProduct & {
  type: "simple" | "grouped" | "external";
  weightUnit: string;
  dimensionUnit: string;
  height?: number;
  length?: number;
  weight?: number;
  width?: number;
  galleryImages: HWCImage[];
  upsellIds: number[];
  content?: {
    rendered: string;
    plain: string;
  };
  meta?: Record<string, string>;
};

type HWCVariableProductDetailed = Omit<HWCSimpleProductDetailed, "type"> & {
  type: "variable";
  variationId: number | null;
  variation: null;
  variationsMinPrice: number;
  variationsMaxPrice: number;
  variations: {
    attributeValues: { [key: string]: string };
    variation: HWCVariation;
  }[];
};

export type HWCProductDetailed =
  | HWCSimpleProductDetailed
  | HWCVariableProductDetailed;
