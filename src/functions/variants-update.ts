import type { HWCVariation } from "../types/product";
import type { HWCProductDetailed } from "../types/product-detailed";
import { getVariantMatch } from "./variants-getters";
import type { HWCAttributeSelection } from "./variants-normalize-selection";
import { normalizeSelection } from "./variants-normalize-selection";
import type { HWCVariantOptionsMap } from "./variants-options";
import { getAvailableOptions } from "./variants-options";

export type HWCVariantState = {
  selection: HWCAttributeSelection;
  variation: HWCVariation | null;
  productView: HWCProductDetailed;
  options: HWCVariantOptionsMap;
};

export function updateSelection(
  product: HWCProductDetailed,
  currentSelection: HWCAttributeSelection,
  changedName: string,
  changedValue: string,
): {
  selection: HWCAttributeSelection;
  variation: HWCVariation | null;
  productView: HWCProductDetailed;
} {
  if (product.type !== "variable") {
    return {
      selection: {} as HWCAttributeSelection,
      variation: null,
      productView: product,
    };
  }
  const normalized = normalizeSelection(product, currentSelection);
  const selection = {
    ...normalized,
    [changedName]: changedValue,
  } as HWCAttributeSelection;

  const variation = getVariantMatch(product, selection);
  if (!variation) {
    return { selection, variation: null, productView: product };
  }

  const productView: HWCProductDetailed = {
    ...product,
    isOnSale: variation.isOnSale,
    isVirtual: variation.isVirtual,
    isFeatured: variation.isFeatured,
    isSoldIndividually: variation.isSoldIndividually,
    image: variation.image,
    id: variation.id,
    name: variation.name,
    stockQuantity: variation.stockQuantity,
    stockStatus: variation.stockStatus,
    slug: variation.slug,
    permalink: variation.permalink,
    currency: variation.currency,
    price: variation.price,
    regularPrice: variation.regularPrice,
    salePrice: variation.salePrice,
    saleStartDatetime: variation.saleStartDatetime,
    saleEndDatetime: variation.saleEndDatetime,
    sku: variation.sku,
    globalUniqueId: variation.globalUniqueId,
    content: variation.content,
    variationId: variation.id,
  } as HWCProductDetailed;

  return { selection, variation, productView };
}

export function getVariantState(
  product: HWCProductDetailed,
  selection?: HWCAttributeSelection,
): HWCVariantState {
  if (product.type !== "variable") {
    return {
      selection: {} as HWCAttributeSelection,
      variation: null,
      productView: product,
      options: {} as any,
    } as HWCVariantState;
  }
  const effective =
    selection && Object.keys(selection).length > 0
      ? normalizeSelection(product, selection)
      : ((product.variations[0]?.attributeValues ??
          ({} as any)) as HWCAttributeSelection);
  const variation = getVariantMatch(product, effective);
  const options = getAvailableOptions(product, effective);
  return {
    selection: effective,
    variation,
    productView: product,
    options,
  } as HWCVariantState;
}

export function changeVariant(
  product: HWCProductDetailed,
  state: HWCVariantState,
  name: string,
  value: string,
): HWCVariantState {
  if (product.type !== "variable") {
    return {
      selection: {} as HWCAttributeSelection,
      variation: null,
      productView: product,
      options: {} as any,
    } as HWCVariantState;
  }
  const { selection, variation, productView } = updateSelection(
    product,
    state.selection,
    name,
    value,
  );
  const options = getAvailableOptions(product, selection);
  return { selection, variation, productView, options } as HWCVariantState;
}
