import { HCCart } from "./classes/Cart";
import { HWCProduct } from "./classes/Product";
import { getProduct } from "./api/getProduct";
import { getProducts } from "./api/getProducts";
import { HWCCartItem } from "./types/CartItem";
import { HWCProductDetailed, HWCProductType } from "./types/Product";

export class HeadlessWC {
  private url: string;
  private cartInstancePromise: Promise<HCCart> | undefined = undefined;

  constructor(url: string) {
    this.url = url;
  }

  async createCart(items: HWCCartItem[] = []): Promise<HCCart> {
    if (!this.cartInstancePromise) {
      this.cartInstancePromise = HCCart.create(this.url, items);
    }
    return this.cartInstancePromise;
  }

  async getProducts(): Promise<HWCProductType[]> {
    return await getProducts(this.url);
  }

  async getProductById(id: number): Promise<HWCProduct> {
    return await getProduct(this.url, id);
  }

  async getProductBySlug(slug: string): Promise<HWCProduct> {
    return await getProduct(this.url, slug);
  }

  getProductFromJSON(json: string | object): HWCProduct {
    const data = typeof json === "string" ? JSON.parse(json) : json;
    return new HWCProduct(data);
  }
}

export default HeadlessWC;
