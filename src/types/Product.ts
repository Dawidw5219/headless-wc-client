export interface HWCProductBasic {
  name: string;
  img: string;
  fullImg: string;
  images: {
    thumbnail: string;
    medium: string;
    medium_large: string;
    large: string;
    woocommerce_thumbnail: string;
    woocommerce_single: string;
    woocommerce_gallery_thumbnail: string;
    full: string;
    thumbnailLQIP: string;
    [key: string]: string;
  };
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
  shortDescription: {
    rendered: string;
    plain: string;
  };
  content: {
    rendered: string;
    plain: string;
  };
  categories: string[];
  tags: string[];
}
