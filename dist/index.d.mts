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
    regular_price: number;
    sale_price?: number;
    image: HWCImage;
};
type HWCSimpleProduct = HWCProductBase & {
    type: "simple" | "grouped" | "external";
    is_on_sale: boolean;
    is_virtual: boolean;
    is_featured: boolean;
    is_sold_individually: boolean;
    stock_quantity?: number;
    stock_status: "onbackorder" | "instock" | "outofstock";
    attributes: HWCAttribute[];
    categories: string[];
    tags: string[];
    sale_start_datetime?: string;
    sale_end_datetime?: string;
    sku?: string;
    global_unique_id?: string;
    short_description?: {
        rendered: string;
        plain: string;
    };
};
type HWCVariation = Omit<HWCSimpleProduct, "type" | "short_description"> & {
    type: "variation";
    content?: {
        rendered: string;
        plain: string;
    };
};
type HWCVariableProduct = Omit<HWCSimpleProduct, "type"> & {
    type: "variable";
    variations_min_price: number;
    variations_max_price: number;
    variations: {
        attribute_values: {
            [key: string]: string;
        };
        variation: HWCVariation;
    }[];
};
type HWCProduct = HWCSimpleProduct | HWCVariableProduct;

type HWCCartProduct = HWCProductBase & {
    variation_id: number | null;
    variation: {
        [key: string]: string;
    } | null;
    quantity: number;
    tax: number;
    total: number;
};

type HWCCustomerData = {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
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

type HWCSimpleProductDetailed = HWCSimpleProduct & {
    type: "simple" | "grouped" | "external";
    weight_unit: string;
    dimension_unit: string;
    height?: number;
    length?: number;
    weight?: number;
    width?: number;
    gallery_images: HWCImage[];
    upsell_ids: number[];
    content?: {
        rendered: string;
        plain: string;
    };
};
type HWCVariableProductDetailed = Omit<HWCSimpleProductDetailed, "type"> & {
    type: "variable";
    variation_id: number | null;
    variation: null;
    variations_min_price: number;
    variations_max_price: number;
    variations: {
        attribute_values: {
            [key: string]: string;
        };
        variation: HWCVariation;
    }[];
};
type HWCProductDetailed = HWCSimpleProductDetailed | HWCVariableProductDetailed;

declare class HWCCart {
    readonly url: string;
    readonly products: HWCCartProduct[];
    readonly subtotal: number;
    readonly tax_total: number;
    readonly discount_total: number;
    readonly shipping_total: number;
    readonly coupon_code: string;
    readonly currency: string;
    readonly shipping_methods: HWCShippingMethod[];
    readonly payment_methods: HWCPaymentMethod[];
    private constructor();
    private get cartItems();
    get total(): string;
    static create(url: string, cartItems?: {
        id: number;
        quantity: number;
    }[]): Promise<HWCCart>;
    revalidateWithServer(): Promise<HWCCart>;
    changeShippingMethod(shippingMethodId: string): HWCCart;
    changeQty(productId: number, newQuantity: number): HWCCart;
    addProduct(product: HWCProductDetailed): HWCCart;
    addProductById(cartItem: {
        id: number;
        quantity: number;
    }): Promise<HWCCart>;
    removeProduct(product: HWCProductDetailed): HWCCart;
    removeProductById(productId: number): Promise<HWCCart>;
    addCouponCode(couponCode: string): Promise<HWCCart | undefined>;
    removeCouponCode(): Promise<HWCCart>;
    submitOrder(props: {
        billingData: HWCCustomerData;
        shippingData?: HWCCustomerData;
        shippingMethodId: string;
        paymentMethodId: string;
        redirectURL?: string;
        furgonetkaPoint?: string;
        furgonetkaPointName?: string;
    }): Promise<HWCOrder>;
    private cloneWithUpdates;
}

declare class HeadlessWC {
    private url;
    private cartInstancePromise;
    constructor(url: string);
    createCart(items?: {
        id: number;
        quantity: number;
    }[]): Promise<HWCCart>;
    getProducts(): Promise<HWCProduct[]>;
    getProductById(id: number): Promise<HWCProductDetailed>;
    getProductBySlug(slug: string): Promise<HWCProductDetailed>;
    static selectProductVariation(product: HWCProductDetailed, attributeValues: {
        [key: string]: string;
    }): HWCProductDetailed;
    static selectProductVariation(product: HWCProductDetailed, attributeValues: {
        [key: string]: string;
    }): HWCProductDetailed;
}

export { type HWCAttribute, HWCCart, type HWCCartProduct, type HWCProduct, type HWCProductDetailed, HeadlessWC, HeadlessWC as default };
