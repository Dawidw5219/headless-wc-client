type HWCAttributeValue = {
    id: string;
    name: string;
};
type HWCAttributeBase = {
    id: string;
    name: string;
    is_for_variations: boolean;
};
type HWCColorAttribute = HWCAttributeBase & {
    type: "color";
    values: (HWCAttributeValue & {
        color: string;
    })[];
};
type HWCImageAttribute = HWCAttributeBase & {
    type: "image";
    values: (HWCAttributeValue & {
        imageUrl: string;
    })[];
};
type HWCSelectAttribute = HWCAttributeBase & {
    type: "select";
    values: HWCAttributeValue[];
};
type HWCAttribute = HWCColorAttribute | HWCImageAttribute | HWCSelectAttribute;

type HWCImage = {
    thumbnail: string;
    medium: string;
    medium_large: string;
    large: string;
    full: string;
    [key: string]: string;
};

type HWCProductBase = {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    currency: string;
    price: number;
    regularPrice: number;
    salePrice?: number;
    image: HWCImage;
};
type HWCSimpleProduct = HWCProductBase & {
    type: "simple" | "grouped" | "external";
    isOnSale: boolean;
    isVirtual: boolean;
    isFeatured: boolean;
    isSoldIndividually: boolean;
    stockQuantity?: number;
    stockStatus: "onbackorder" | "instock" | "outofstock";
    attributes: HWCAttribute[];
    categories: string[];
    tags: string[];
    saleStartDatetime?: string;
    saleEndDatetime?: string;
    sku?: string;
    globalUniqueId?: string;
    shortDescription?: {
        rendered: string;
        plain: string;
    };
};
type HWCVariation = Omit<HWCSimpleProduct, "type" | "shortDescription"> & {
    type: "variation";
    content?: {
        rendered: string;
        plain: string;
    };
};
type HWCVariableProduct = Omit<HWCSimpleProduct, "type"> & {
    type: "variable";
    variationsMinPrice: number;
    variationsMaxPrice: number;
    variations: {
        attributeValues: {
            [key: string]: string;
        };
        variation: HWCVariation;
    }[];
};
type HWCProduct = HWCSimpleProduct | HWCVariableProduct;

type HWCCartItem = HWCProductBase & {
    variationId: number | null;
    variation: {
        [key: string]: string;
    } | null;
    quantity: number;
    tax: number;
    total: number;
};

type HWCPaymentMethod = {
    id: string;
    title: string;
    description: string;
};

type HWCShippingMethod = {
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

type HWCCart = {
    products: HWCCartItem[];
    total: number;
    subtotal: number;
    taxTotal: number;
    discountTotal: number;
    shippingTotal: number;
    couponCode: string;
    currency: string;
    shippingMethods: HWCShippingMethod[];
    paymentMethods: HWCPaymentMethod[];
    customFields?: Record<string, unknown>;
};

type HWCCartItemInput = {
    id: number;
    quantity: number;
} | {
    slug: string;
    quantity: number;
};

declare function addToCart$1(cartItems: HWCCartItemInput[], input: {
    id: number;
    quantity?: number;
} | {
    slug: string;
    quantity?: number;
}): Promise<HWCCart>;

declare function applyCoupon$1(cartItems: HWCCartItemInput[], code: string): Promise<HWCCart>;
declare function removeCoupon$1(cartItems: HWCCartItemInput[]): Promise<HWCCart>;

type HWCCustomerData = {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone: string;
    email: string;
};

type HWCOrder = {
    success: boolean;
    orderId: number;
    paymentUrl: string;
};

declare function createOrder$1(args: {
    cartItems: ({
        id: number;
        quantity: number;
    } | {
        slug: string;
        quantity: number;
    })[];
    couponCode?: string;
    billingData: HWCCustomerData;
    shippingData?: HWCCustomerData;
    shippingMethodId?: string;
    paymentMethodId?: string;
    redirectURL?: string;
    customFields?: {
        [key: string]: any;
    };
}): Promise<HWCOrder>;

declare function getCart(cartItems: HWCCartItemInput[]): Promise<HWCCart>;

type HWCOrderItem = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    unit_price: number;
    sku: string;
    image: string;
};
type HWCAddress = {
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
type HWCOrderDetails = {
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
        custom_fields: {
            [key: string]: any;
        };
    };
};

declare function getOrderDetails$1(orderId: number, orderKey: string): Promise<HWCOrderDetails>;

type HWCSimpleProductDetailed = HWCSimpleProduct & {
    type: "simple" | "grouped" | "external";
    weightUnit: string;
    dimensionUnit: string;
    height?: number;
    length?: number;
    weight?: number;
    width?: number;
    galleryImages: HWCImage[];
    upsellIds: number[];
    content?: {
        rendered: string;
        plain: string;
    };
};
type HWCVariableProductDetailed = Omit<HWCSimpleProductDetailed, "type"> & {
    type: "variable";
    variationId: number | null;
    variation: null;
    variationsMinPrice: number;
    variationsMaxPrice: number;
    variations: {
        attributeValues: {
            [key: string]: string;
        };
        variation: HWCVariation;
    }[];
};
type HWCProductDetailed = HWCSimpleProductDetailed | HWCVariableProductDetailed;

declare function removeFromCart$1(cartItems: HWCCartItemInput[], idOrSlug: number | string): Promise<HWCCart>;

declare function updateCart$1(cartItems: HWCCartItemInput[], changes: ({
    id: number;
    quantity: number;
} | {
    slug: string;
    quantity: number;
})[]): Promise<HWCCart>;

declare function updateCartItem$1(cartItems: HWCCartItemInput[], change: {
    id?: number;
    slug?: string;
    quantity: number;
}): Promise<HWCCart>;

declare function getProducts(params?: {
    search?: string;
    category?: string;
    page?: number;
    perPage?: number;
    sort?: string;
    order?: "asc" | "desc";
}): Promise<HWCProduct[]>;
declare function getProduct(idOrSlug: number | string): Promise<HWCProductDetailed>;
declare function getProductById(id: number): Promise<HWCProductDetailed>;
declare function getProductBySlug(slug: string): Promise<HWCProductDetailed>;
declare const createCart: typeof getCart;
declare const addToCart: typeof addToCart$1;
declare const updateCartItem: typeof updateCartItem$1;
declare const updateCart: typeof updateCart$1;
declare const removeFromCart: typeof removeFromCart$1;
declare const applyCoupon: typeof applyCoupon$1;
declare const removeCoupon: typeof removeCoupon$1;
declare const createOrder: typeof createOrder$1;
declare const getOrderDetails: typeof getOrderDetails$1;
declare function revalidateProducts(): Promise<void>;
declare function revalidatePages(): Promise<void>;
declare function revalidateNextjsCache(): Promise<void>;

export { addToCart, applyCoupon, createCart, createOrder, getOrderDetails, getProduct, getProductById, getProductBySlug, getProducts, removeCoupon, removeFromCart, revalidateNextjsCache, revalidatePages, revalidateProducts, updateCart, updateCartItem };
