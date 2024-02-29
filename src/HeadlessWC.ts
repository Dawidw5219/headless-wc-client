import { HeadlessWCCart } from "./HeadlessWCCart";
import { HWCCartItem } from "./types/HWCCartItem";

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
}

export default HeadlessWC;
