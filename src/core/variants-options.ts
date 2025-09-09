import type { HWCProductDetailed } from "../types/product-detailed";
import type { HWCAttributeSelection } from "./variants-normalize-selection";
import { normalizeSelection } from "./variants-normalize-selection";

export type HWCVariantOption = {
  value: string;
  available: boolean;
  selected: boolean;
};
export type HWCVariantOptionsMap = Record<string, HWCVariantOption[]>;

export function getAvailableOptions(
  product: HWCProductDetailed,
  partialSelection: HWCAttributeSelection,
): HWCVariantOptionsMap {
  if (product.type !== "variable") return {} as HWCVariantOptionsMap;
  const normalized = normalizeSelection(product, partialSelection);
  const result: HWCVariantOptionsMap = {} as HWCVariantOptionsMap;

  for (const attr of product.attributes) {
    const name = attr.name;
    const values = attr.values.map((v: { name: string }) => v.name);
    const options = values.map((value: string) => {
      const candidate = { ...normalized, [name]: value } as Record<
        string,
        string
      >;
      const available = product.variations.some(
        (v: { attributeValues: Record<string, string> }) =>
          Object.entries(candidate).every(
            ([n, val]) => v.attributeValues[n] === val,
          ),
      );
      const selected = (normalized as any)[name] === value;
      return { value, available, selected } as any;
    });
    (result as any)[name] = options;
  }

  return result;
}
