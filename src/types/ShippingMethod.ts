import { HWCLocation } from "./Location";

export interface HWCShippingMethod {
  name: string;
  id: string;
  price: number;
  tax: number;
  zone: string;
  locations: HWCLocation[];
}
