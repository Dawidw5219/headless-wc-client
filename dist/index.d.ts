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

type HWCCartProduct = HWCProductBase & {
    variationId: number | null;
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

type HWCCartType = {
    products: HWCCartProduct[];
    total: number;
    subtotal: number;
    taxTotal: number;
    discountTotal: number;
    shippingTotal: number;
    couponCode: string;
    currency: string;
    shippingMethods: HWCShippingMethod[];
    paymentMethods: HWCPaymentMethod[];
    customFields?: {
        [key: string]: any;
    };
};

declare class HWCCart implements HWCCartType {
    total: number;
    readonly url: string;
    readonly products: HWCCartProduct[];
    readonly subtotal: number;
    readonly taxTotal: number;
    readonly discountTotal: number;
    readonly shippingTotal: number;
    readonly couponCode: string;
    readonly currency: string;
    readonly shippingMethods: HWCShippingMethod[];
    readonly paymentMethods: HWCPaymentMethod[];
    readonly customFields?: {
        [key: string]: any;
    };
    private constructor();
    private get cartItems();
    private cloneWithUpdates;
    static create(url: string, cartItems?: ({
        id: number;
        quantity: number;
    } | {
        slug: string;
        quantity: number;
    })[], customFields?: {
        [key: string]: any;
    }): Promise<HWCCart>;
    revalidateWithServer(): Promise<HWCCart>;
    changeShippingMethod(shippingMethodId: string): HWCCart;
    changeQty(productId: number, newQuantity: number): HWCCart;
    addProduct(product: HWCProductDetailed): HWCCart;
    addProductById(cartItem: {
        id: number;
        quantity: number;
    }): Promise<HWCCart>;
    addProductBySlug(cartItem: {
        slug: string;
        quantity: number;
    }): Promise<HWCCart>;
    removeProduct(product: HWCProductDetailed): HWCCart;
    removeProductById(productId: number): Promise<HWCCart>;
    addCouponCode(couponCode: string): Promise<HWCCart | undefined>;
    removeCouponCode(): Promise<HWCCart>;
    updateCustomFields(customFields: {
        [key: string]: any;
    }): Promise<HWCCart>;
    submitOrder(props: {
        billingData: HWCCustomerData;
        shippingData?: HWCCustomerData;
        shippingMethodId: string;
        paymentMethodId: string;
        redirectURL?: string;
        furgonetkaPoint?: string;
        furgonetkaPointName?: string;
        customFields?: {
            [key: string]: any;
        };
    }): Promise<HWCOrder>;
}

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

type ResponseError = {
    success: false;
    message: string;
    error: string;
};

declare class HeadlessWC {
    private url;
    private cartInstancePromise;
    constructor(url: string);
    createCart(items?: ({
        id: number;
        quantity: number;
    } | {
        slug: string;
        quantity: number;
    })[], customFields?: {
        [key: string]: any;
    }): Promise<HWCCart | ResponseError>;
    getProducts(): Promise<HWCProduct[] | ResponseError>;
    getProductById(id: number): Promise<HWCProductDetailed | ResponseError>;
    getProductBySlug(slug: string): Promise<HWCProductDetailed | ResponseError>;
    getOrderDetails(orderId: number, orderKey: string): Promise<HWCOrderDetails | ResponseError>;
    createOrder(items: ({
        id: number;
        quantity: number;
    } | {
        slug: string;
        quantity: number;
    })[], props: {
        billingData: HWCCustomerData;
        shippingData?: HWCCustomerData;
        shippingMethodId?: string;
        paymentMethodId?: string;
        redirectURL?: string;
        couponCode?: string;
        customFields?: {
            [key: string]: any;
        };
    }): Promise<HWCOrder | ResponseError>;
    static selectProductVariation(product: HWCProductDetailed, attributeValues: {
        [key: string]: string;
    }): HWCProductDetailed;
    static selectProductVariation(product: HWCProductDetailed, attributeValues: {
        [key: string]: string;
    }): HWCProductDetailed;
}

export { type HWCAddress, type HWCAttribute, HWCCart, type HWCCartProduct, type HWCCustomerData, type HWCOrder, type HWCOrderDetails, type HWCOrderItem, type HWCProduct, type HWCProductDetailed, HeadlessWC, type ResponseError, HeadlessWC as default };
