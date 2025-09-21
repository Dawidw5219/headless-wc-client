import type { HWCVariation } from "../types/product";
import type { HWCProductDetailed } from "../types/product-detailed";
import type { HWCAttributeSelection } from "./variants-normalize-selection";
import { normalizeSelection } from "./variants-normalize-selection";

export function getVariantMatch(
  product: HWCProductDetailed,
  selection: HWCAttributeSelection,
): HWCVariation | null {
  if (product.type !== "variable") return null;
  const normalized = normalizeSelection(product, selection);
  const match = product.variations.find(
    (v: { attributeValues: Record<string, string>; variation: HWCVariation }) =>
      Object.entries(normalized).every(
        ([name, value]) => v.attributeValues[name] === value,
      ),
  );
  return match?.variation ?? null;
}

export function getInitialSelection(
  product: HWCProductDetailed,
): HWCAttributeSelection {
  if (product.type !== "variable") return {};
  if (product.variationId) {
    const found = product.variations.find(
      (v: { variation: { id: number } }) =>
        v.variation.id === product.variationId,
    );
    if (found) return { ...found.attributeValues } as HWCAttributeSelection;
  }
  return {
    ...(product.variations[0]?.attributeValues ?? {}),
  } as HWCAttributeSelection;
}
