import { HWCImage } from "./Image";
import { HWCProductBase, HWCSimpleProduct, HWCVariation } from "./Product";

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

export type HWCProductDetailed = HWCSimpleProductDetailed | HWCVariableProductDetailed;
