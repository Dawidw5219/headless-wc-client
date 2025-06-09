import { HWCProductBase } from "./Product";

export type HWCCartProduct = HWCProductBase & {
  variationId: number | null;
  variation: { [key: string]: string } | null;
  quantity: number;
  tax: number;
  total: number;
};
