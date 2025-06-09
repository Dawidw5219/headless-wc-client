import { HWCCart as HWCCart } from "./classes/Cart";
import { HWCProduct } from "./types/Product";
import { HWCProductDetailed } from "./types/ProductDetailed";
import { HWCOrderDetails } from "./types/OrderDetails";
import { getProduct } from "./api/getProduct";
import { getProducts } from "./api/getProducts";
import { getOrderDetails } from "./api/getOrderDetails";

export class HeadlessWC {
  private url: string;
  private cartInstancePromise: Promise<HWCCart> | undefined = undefined;

  constructor(url: string) {
    this.url = url;
  }

  async createCart(
    items: (
      | { id: number; quantity: number }
      | { slug: string; quantity: number }
    )[] = [],
    customFields?: { [key: string]: any }
  ): Promise<HWCCart> {
    if (!this.cartInstancePromise) {
      this.cartInstancePromise = HWCCart.create(this.url, items, customFields);
    }
    return this.cartInstancePromise;
  }

  async getProducts(): Promise<HWCProduct[]> {
    return await getProducts(this.url);
  }

  async getProductById(id: number): Promise<HWCProductDetailed> {
    return await getProduct(this.url, id);
  }

  async getProductBySlug(slug: string): Promise<HWCProductDetailed> {
    return await getProduct(this.url, slug);
  }

  async getOrderDetails(
    orderId: number,
    orderKey: string
  ): Promise<HWCOrderDetails> {
    return await getOrderDetails(this.url, orderId, orderKey);
  }

  static selectProductVariation(
    product: HWCProductDetailed,
    attributeValues: { [key: string]: string }
  ): HWCProductDetailed;
  static selectProductVariation(
    product: HWCProductDetailed,
    attributeValues: { [key: string]: string }
  ): HWCProductDetailed;

  static selectProductVariation(
    product: HWCProductDetailed | HWCProductDetailed,
    attributeValues: { [key: string]: string }
  ): HWCProductDetailed | HWCProductDetailed {
    if (product.type !== "variable")
      throw new Error("Cannot select variation for non-variable product");
    const variation = product.variations!.find((variation) =>
      Object.entries(attributeValues).every(
        ([key, value]) => variation.attributeValues[key] === value
      )
    )?.variation;
    if (!variation) return product;

    return {
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
    };
  }
}
