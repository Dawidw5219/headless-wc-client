export type HWCOrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  unit_price: number;
  sku: string;
  image: string;
};

export type HWCAddress = {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
};

export type HWCOrderDetails = {
  success: boolean;
  order: {
    id: number;
    order_key: string;
    status: string;
    currency: string;
    date_created: string;
    date_modified: string;
    payment_method: string;
    payment_method_title: string;
    total: number;
    subtotal: number;
    total_tax: number;
    shipping_total: number;
    discount_total: number;
    items: HWCOrderItem[];
    billing: HWCAddress;
    shipping: HWCAddress;
    customer_note: string;
    custom_fields: { [key: string]: any };
  };
};
