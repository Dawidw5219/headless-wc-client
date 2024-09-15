import { HWCCart as HWCCart } from "./classes/Cart";
import { HWCProduct } from "./types/Product";
import { HWCProductDetailed } from "./types/ProductDetailed";
import { getProduct } from "./api/getProduct";
import { getProducts } from "./api/getProducts";

export class HeadlessWC {
  private url: string;
  private cartInstancePromise: Promise<HWCCart> | undefined = undefined;

  constructor(url: string) {
    this.url = url;
  }

  async createCart(items: { id: number; quantity: number }[] = []): Promise<HWCCart> {
    if (!this.cartInstancePromise) {
      this.cartInstancePromise = HWCCart.create(this.url, items);
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
    if (product.type !== "variable") throw new Error("Cannot select variation for non-variable product");
    const variation = product.variations!.find((variation) =>
      Object.entries(attributeValues).every(([key, value]) => variation.attribute_values[key] === value)
    )?.variation;
    if (!variation) return product;

    return {
      ...product,
      is_on_sale: variation.is_on_sale,
      is_virtual: variation.is_virtual,
      is_featured: variation.is_featured,
      is_sold_individually: variation.is_sold_individually,
      image: variation.image,
      id: variation.id,
      name: variation.name,
      stock_quantity: variation.stock_quantity,
      stock_status: variation.stock_status,
      slug: variation.slug,
      permalink: variation.permalink,
      currency: variation.currency,
      price: variation.price,
      regular_price: variation.regular_price,
      sale_price: variation.sale_price,
      sale_start_datetime: variation.sale_start_datetime,
      sale_end_datetime: variation.sale_end_datetime,
      sku: variation.sku,
      global_unique_id: variation.global_unique_id,
      content: variation.content,
    };
  }
}
