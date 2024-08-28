import { HeadlessWCCart } from "./HeadlessWCCart";
import { getProduct } from "./api/getProduct";
import { getProducts } from "./api/getProducts";
import { HWCCartItem } from "./types/CartItem";
import { HWCProductDetailed } from "./types/Product";

export class HeadlessWC {
  private url: string;
  private cartInstancePromise: Promise<HeadlessWCCart> | undefined = undefined;

  constructor(url: string) {
    this.url = url;
  }

  async createCart(items: HWCCartItem[] = []): Promise<HeadlessWCCart> {
    if (!this.cartInstancePromise) {
      this.cartInstancePromise = HeadlessWCCart.create(this.url, items);
    }
    return this.cartInstancePromise;
  }

  async getProducts(): Promise<HWCProductDetailed[]> {
    return await getProducts(this.url);
  }

  async getProductById(id: number): Promise<HWCProductDetailed> {
    return await getProduct(this.url, id);
  }

  async getProductBySlug(slug: string): Promise<HWCProductDetailed> {
    return await getProduct(this.url, slug);
  }
}

export default HeadlessWC;
