import { HWCProductBase } from "./Product";

export type HWCCartProduct = HWCProductBase & {
  variation_id: number | null;
  variation: { [key: string]: string } | null;
  quantity: number;
  tax: number;
  total: number;
};
