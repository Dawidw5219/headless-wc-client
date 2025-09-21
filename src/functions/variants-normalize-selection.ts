import type { HWCAttribute } from "../types/attribute";
import type { HWCProductDetailed } from "../types/product-detailed";
export type HWCAttributeSelection = Record<string, string>;

function canonicalizeKey(key: string): string {
  return key.trim().toLowerCase();
}

function buildAttributeKeyMap(
  attributes: HWCAttribute[],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const attr of attributes) {
    map[canonicalizeKey(attr.name)] = attr.name;
  }
  return map;
}

export function normalizeSelection(
  product: HWCProductDetailed,
  selection: HWCAttributeSelection,
): HWCAttributeSelection {
  if (product.type !== "variable") return {};
  const keyMap = buildAttributeKeyMap(product.attributes);
  const normalized: HWCAttributeSelection = {} as HWCAttributeSelection;
  for (const [k, v] of Object.entries(selection)) {
    const canonical = canonicalizeKey(k);
    const original = keyMap[canonical] ?? k;
    (normalized as any)[original] = v;
  }
  return normalized;
}
