interface HWCCartItem {
    id: number;
    quantity: number;
}

interface HWCCustomerData {
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
}

interface HWCOrder {
    success: boolean;
    orderId: number;
    paymentUrl: string;
}

interface HWCPaymentMethod {
    id: string;
    title: string;
    description: string;
}

interface HWCImage {
    thumbnail: string;
    medium: string;
    medium_large: string;
    large: string;
    full: string;
    [key: string]: string;
}

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

type HWCProductBase = {
    is_on_sale: boolean;
    is_virtual: boolean;
    is_featured: boolean;
    is_sold_individually: boolean;
    image: HWCImage;
    id: number;
    name: string;
    stock_quantity?: number;
    stock_status: "onbackorder" | "instock" | "outofstock";
    slug: string;
    permalink: string;
    currency: string;
    price: number;
    regular_price: number;
    attributes: HWCAttribute[];
    categories: string[];
    tags: string[];
    sale_price?: number;
    sale_start_datetime?: string;
    sale_end_datetime?: string;
    sku?: string;
    global_unique_id?: string;
    short_description?: {
        rendered: string;
        plain: string;
    };
    quantity: number;
    total: number;
};
type HWCSimpleProduct = HWCProductBase & {
    type: "simple" | "grouped" | "external";
};
type HWCVariableProduct = HWCProductBase & {
    type: "variable";
    variations_min_price: number;
    variations_max_price: number;
};
type HWCProductType = HWCSimpleProduct | HWCVariableProduct;
interface HWCProductDetailedBase extends HWCProductBase {
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
}
type HWCSimpleProductDetailed = HWCProductDetailedBase & {
    type: "simple" | "grouped" | "external";
};
type HWCVariableProductDetailed = HWCProductDetailedBase & {
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
type HWCVariation = Omit<HWCProductBase, "short_description"> & {
    type: "variation";
    content?: {
        rendered: string;
        plain: string;
    };
};
type HWCProductDetailed = HWCSimpleProductDetailed | HWCVariableProductDetailed;

interface HWCLocation {
    type: string;
    code: string;
}

interface HWCShippingMethod {
    name: string;
    id: string;
    price: number;
    tax: number;
    zone: string;
    locations: HWCLocation[];
}

declare class HCCart {
    readonly url: string;
    readonly products: HWCProductType[];
    readonly subtotal: number;
    readonly taxTotal: number;
    readonly discountTotal: number;
    readonly shippingTotal: number;
    readonly couponCode: string;
    readonly currency: string;
    readonly availableShippingMethods: HWCShippingMethod[];
    readonly availablePaymentMethods: HWCPaymentMethod[];
    private constructor();
    get cartItems(): HWCCartItem[];
    get total(): number;
    static create(url: string, items?: HWCCartItem[]): Promise<HCCart>;
    changeShippingMethod(shippingMethodId: string): HCCart;
    changeQty(productId: number, newQuantity: number): HCCart;
    addProduct(cartItem: HWCCartItem): Promise<HCCart>;
    removeProduct(productId: number): Promise<HCCart>;
    addCouponCode(couponCode: string): Promise<HCCart | undefined>;
    removeCouponCode(): Promise<HCCart>;
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
    private static fetchCart;
}

declare class HWCProduct {
    type: "simple" | "variable" | "grouped" | "external";
    weight_unit: string;
    dimension_unit: string;
    height?: number;
    length?: number;
    weight?: number;
    width?: number;
    gallery_images: HWCImage[];
    upsell_ids: number[];
    cross_sell_ids: number[];
    content?: {
        rendered: string;
        plain: string;
    };
    is_on_sale: boolean;
    is_virtual: boolean;
    is_featured: boolean;
    is_sold_individually: boolean;
    image: HWCImage;
    id: number;
    name: string;
    stock_quantity?: number;
    stock_status: "onbackorder" | "instock" | "outofstock";
    slug: string;
    permalink: string;
    currency: string;
    price: number;
    regular_price: number;
    attributes: HWCAttribute[];
    categories: string[];
    tags: string[];
    sale_price?: number;
    sale_start_datetime?: string;
    sale_end_datetime?: string;
    sku?: string;
    global_unique_id?: string;
    short_description?: {
        rendered: string;
        plain: string;
    };
    variations_min_price?: number;
    variations_max_price?: number;
    variations?: {
        attribute_values: {
            [key: string]: string;
        };
        variation: HWCVariation;
    }[];
    constructor(props: {
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
        is_on_sale: boolean;
        is_virtual: boolean;
        is_featured: boolean;
        is_sold_individually: boolean;
        image: HWCImage;
        id: number;
        name: string;
        stock_quantity?: number;
        stock_status: "onbackorder" | "instock" | "outofstock";
        slug: string;
        permalink: string;
        currency: string;
        price: number;
        regular_price: number;
        attributes: HWCAttribute[];
        categories: string[];
        tags: string[];
        sale_price?: number;
        sale_start_datetime?: string;
        sale_end_datetime?: string;
        sku?: string;
        global_unique_id?: string;
        short_description?: {
            rendered: string;
            plain: string;
        };
        variations_min_price?: number;
        variations_max_price?: number;
        variations?: {
            attribute_values: {
                [key: string]: string;
            };
            variation: HWCVariation;
        }[];
    });
    toJSON(): string;
    private cloneWithUpdates;
    updateVariation(attributeValues: {
        [key: string]: string;
    }): HWCProduct;
}

declare class HeadlessWC {
    private url;
    private cartInstancePromise;
    constructor(url: string);
    createCart(items?: HWCCartItem[]): Promise<HCCart>;
    getProducts(): Promise<HWCProductType[]>;
    getProductById(id: number): Promise<HWCProduct>;
    getProductBySlug(slug: string): Promise<HWCProduct>;
    getProductFromJSON(json: string | object): HWCProduct;
}

export { type HWCAttribute, HWCProduct, type HWCProductDetailed, type HWCProductType, HeadlessWC, HCCart as HeadlessWCCart };
