export type HWCShippingMethod = {
  name: string;
  id: string;
  price: number;
  tax: number;
  zone: string;
  locations: {
    type: string;
    code: string;
  }[];
};
