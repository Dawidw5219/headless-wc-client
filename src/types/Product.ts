export interface HWCProductBasic {
  name: string;
  img: string;
  fullImg: string;
  id: number;
  quantity: number;
  price: number;
  regularPrice: number;
  salePrice: number;
  isOnsale: boolean;
  total: number;
  tax: number;
}

export interface HWCProductDetailed extends HWCProductBasic {
  permalink: string;
  slug: string;
  stockStatus: string;
  excerpt: string;
  content: {
    rendered: string;
    plain: string;
  };
  categories: string[];
  tags: string[];
}
