import type { HWCProductBase } from "./product";

export type HWCCartItem = HWCProductBase & {
  variationId: number | null;
  variation: { [key: string]: string } | null;
  quantity: number;
  tax: number;
  total: number;
};
