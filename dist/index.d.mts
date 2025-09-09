interface HWCTaxonomyTermBase {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parent?: number;
    count?: number;
    link?: string;
    meta?: any[];
}
type WPTerm<TTaxonomy extends string> = HWCTaxonomyTermBase & {
    taxonomy: TTaxonomy;
};
type HWCProductCategory = HWCTaxonomyTermBase & {
    taxonomy: "product_cat";
};
type HWCProductTag = HWCTaxonomyTermBase & {
    taxonomy: "product_tag";
};
interface HWCTaxonomyQuery {
    search?: string;
    page?: number;
    perPage?: number;
    parent?: number;
    hideEmpty?: boolean;
}
type WPPost = {
    id: number;
    date: string;
    date_gmt: string;
    guid: {
        rendered: string;
    };
    modified: string;
    modified_gmt: string;
    slug: string;
    status: "publish" | "future" | "draft" | "pending" | "private";
    type: string;
    link: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
        protected: boolean;
    };
    excerpt: {
        rendered: string;
        protected: boolean;
    };
    author: number;
    featured_media: number;
    comment_status: "open" | "closed";
    ping_status: "open" | "closed";
    sticky: boolean;
    template: string;
    format: "standard" | "aside" | "chat" | "gallery" | "link" | "image" | "quote" | "status" | "video" | "audio";
    meta: any[];
    categories: number[];
    tags: number[];
};
type WPCategory = WPTerm<"category">;
type WPTag = WPTerm<"post_tag">;
type WPPage = {
    id: number;
    date: string;
    date_gmt: string;
    guid: {
        rendered: string;
    };
    modified: string;
    modified_gmt: string;
    slug: string;
    status: "publish" | "future" | "draft" | "pending" | "private";
    type: string;
    link: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
        protected: boolean;
    };
    excerpt: {
        rendered: string;
        protected: boolean;
    };
    author: number;
    featured_media: number;
    parent: number;
    menu_order: number;
    comment_status: "open" | "closed";
    ping_status: "open" | "closed";
    template: string;
    meta: any[];
};
type WPAuthor = {
    id: number;
    name: string;
    url: string;
    description: string;
    link: string;
    slug: string;
    avatar_urls: {
        [key: string]: string;
    };
    meta: any[];
};
type WPFeaturedMedia = {
    id: number;
    date: string;
    slug: string;
    type: string;
    link: string;
    title: {
        rendered: string;
    };
    author: number;
    caption: {
        rendered: string;
    };
    alt_text: string;
    media_type: string;
    mime_type: string;
    media_details: {
        width: number;
        height: number;
        file: string;
        sizes: {
            [key: string]: {
                file: string;
                width: number;
                height: number;
                mime_type: string;
                source_url: string;
            };
        };
    };
    source_url: string;
};

declare function getAllPosts(filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
}): Promise<WPPost[]>;
declare function getPostById(id: number): Promise<WPPost>;
declare function getPostBySlug(slug: string): Promise<WPPost>;
declare function getAllCategories(): Promise<WPCategory[]>;
declare function getCategoryById(id: number): Promise<WPCategory>;
declare function getCategoryBySlug(slug: string): Promise<WPCategory>;
declare function getPostsByCategory(categoryId: number): Promise<WPPost[]>;
declare function getPostsByTag(tagId: number): Promise<WPPost[]>;
declare function getTagsByPost(postId: number): Promise<WPTag[]>;
declare function getAllTags(): Promise<WPTag[]>;
declare function getTagById(id: number): Promise<WPTag>;
declare function getTagBySlug(slug: string): Promise<WPTag>;
declare function getAllPages(): Promise<WPPage[]>;
declare function getPageById(id: number): Promise<WPPage>;
declare function getPageBySlug(slug: string): Promise<WPPage>;
declare function getAllAuthors(): Promise<WPAuthor[]>;
declare function getAuthorById(id: number): Promise<WPAuthor>;
declare function getAuthorBySlug(slug: string): Promise<WPAuthor>;
declare function getPostsByAuthor(authorId: number): Promise<WPPost[]>;
declare function getPostsByAuthorSlug(authorSlug: string): Promise<WPPost[]>;
declare function getPostsByCategorySlug(categorySlug: string): Promise<WPPost[]>;
declare function getPostsByTagSlug(tagSlug: string): Promise<WPPost[]>;
declare function getFeaturedMediaById(url: string, id: number): Promise<WPFeaturedMedia>;
declare function getProductCategories(params?: HWCTaxonomyQuery): Promise<HWCProductCategory[]>;
declare function getProductTags(params?: HWCTaxonomyQuery): Promise<HWCProductTag[]>;
declare function getProductCategoryById(id: number): Promise<HWCProductCategory>;
declare function getProductCategoryBySlug(slug: string): Promise<HWCProductCategory>;
declare function getProductTagById(id: number): Promise<HWCProductTag>;
declare function getProductTagBySlug(slug: string): Promise<HWCProductTag>;

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

type HWCCartItemInput$1 = {
    id: number;
    quantity: number;
} | {
    slug: string;
    quantity: number;
};

declare function addToCart(cartItems: HWCCartItemInput$1[], input: {
    id: number;
    quantity?: number;
} | {
    slug: string;
    quantity?: number;
}): Promise<HWCCart>;

declare function applyCoupon(cartItems: HWCCartItemInput$1[], code: string): Promise<HWCCart>;
declare function removeCoupon(cartItems: HWCCartItemInput$1[]): Promise<HWCCart>;

declare function setWooCommerceUrl(baseUrl: string): void;
declare function getBaseUrl(): string;

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

declare function createOrder(args: {
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

declare function getCart(cartItems: HWCCartItemInput$1[]): Promise<HWCCart>;
declare const createCart: typeof getCart;

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

declare function getOrderDetails(orderId: number, orderKey: string): Promise<HWCOrderDetails>;

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

declare function getProduct(idOrSlug: number | string): Promise<HWCProductDetailed>;

type HWCProductQuery = {
    search?: string;
    category?: string;
    page?: number;
    perPage?: number;
    sort?: string;
    order?: "asc" | "desc";
};

declare function getProducts(params?: HWCProductQuery): Promise<HWCProduct[]>;

declare function removeFromCart(cartItems: HWCCartItemInput$1[], idOrSlug: number | string): Promise<HWCCart>;

type HWCCartItemInput = {
    id: number;
    quantity: number;
};
declare function revalidateCart(cartItems: HWCCartItemInput[]): Promise<HWCCart>;

declare function updateCart(cartItems: HWCCartItemInput$1[], changes: ({
    id: number;
    quantity: number;
} | {
    slug: string;
    quantity: number;
})[]): Promise<HWCCart>;

declare function updateCartItem(cartItems: HWCCartItemInput$1[], change: {
    id?: number;
    slug?: string;
    quantity: number;
}): Promise<HWCCart>;

type HWCAttributeSelection = Record<string, string>;
declare function normalizeSelection(product: HWCProductDetailed, selection: HWCAttributeSelection): HWCAttributeSelection;

declare function getVariantMatch(product: HWCProductDetailed, selection: HWCAttributeSelection): HWCVariation | null;
declare function getInitialSelection(product: HWCProductDetailed): HWCAttributeSelection;

type HWCVariantOption = {
    value: string;
    available: boolean;
    selected: boolean;
};
type HWCVariantOptionsMap = Record<string, HWCVariantOption[]>;
declare function getAvailableOptions(product: HWCProductDetailed, partialSelection: HWCAttributeSelection): HWCVariantOptionsMap;

type HWCVariantState = {
    selection: HWCAttributeSelection;
    variation: HWCVariation | null;
    productView: HWCProductDetailed;
    options: HWCVariantOptionsMap;
};
declare function updateSelection(product: HWCProductDetailed, currentSelection: HWCAttributeSelection, changedName: string, changedValue: string): {
    selection: HWCAttributeSelection;
    variation: HWCVariation | null;
    productView: HWCProductDetailed;
};
declare function getVariantState(product: HWCProductDetailed, selection?: HWCAttributeSelection): HWCVariantState;
declare function changeVariant(product: HWCProductDetailed, state: HWCVariantState, name: string, value: string): HWCVariantState;

type HWCData<T> = {
    success: true;
    data: T;
};
type HWCError = {
    success: false;
    message: string;
    error: string;
};
type HWCResp<T> = HWCData<T> | HWCError;

declare function revalidateProducts(): Promise<void>;
declare function revalidatePages(): Promise<void>;
declare function revalidateNextjsCache(): Promise<void>;

export { type HWCCart, type HWCCartItem, type HWCCustomerData, type HWCError, type HWCOrder, type HWCOrderDetails, type HWCProduct, type HWCProductCategory, type HWCProductDetailed, type HWCProductTag, type HWCResp, type HWCTaxonomyQuery, addToCart, applyCoupon, changeVariant, createCart, createOrder, getAllAuthors, getAllCategories, getAllPages, getAllPosts, getAllTags, getAuthorById, getAuthorBySlug, getAvailableOptions, getBaseUrl, getCart, getCategoryById, getCategoryBySlug, getFeaturedMediaById, getInitialSelection, getOrderDetails, getPageById, getPageBySlug, getPostById, getPostBySlug, getPostsByAuthor, getPostsByAuthorSlug, getPostsByCategory, getPostsByCategorySlug, getPostsByTag, getPostsByTagSlug, getProduct, getProductCategories, getProductCategoryById, getProductCategoryBySlug, getProductTagById, getProductTagBySlug, getProductTags, getProducts, getTagById, getTagBySlug, getTagsByPost, getVariantMatch, getVariantState, normalizeSelection, removeCoupon, removeFromCart, revalidateCart, revalidateNextjsCache, revalidatePages, revalidateProducts, setWooCommerceUrl, updateCart, updateCartItem, updateSelection };
