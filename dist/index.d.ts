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

interface HWCProductBasic {
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
interface HWCProductDetailed extends HWCProductBasic {
    permalink: string;
    slug: string;
    stockStatus: string;
    excerpt: string;
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
    content: {
        rendered: string;
        plain: string;
    };
    categories: string[];
    tags: string[];
}

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

declare class HeadlessWCCart {
    readonly url: string;
    readonly products: HWCProductBasic[];
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
    static create(url: string, items?: HWCCartItem[]): Promise<HeadlessWCCart>;
    changeShippingMethod(shippingMethodId: string): HeadlessWCCart;
    changeQty(productId: number, newQuantity: number): HeadlessWCCart;
    addProduct(cartItem: HWCCartItem): Promise<HeadlessWCCart>;
    removeProduct(productId: number): Promise<HeadlessWCCart>;
    addCouponCode(couponCode: string): Promise<HeadlessWCCart | undefined>;
    removeCouponCode(): Promise<HeadlessWCCart>;
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

declare class HeadlessWC {
    private url;
    private cartInstancePromise;
    constructor(url: string);
    createCart(items?: HWCCartItem[]): Promise<HeadlessWCCart>;
    getProducts(): Promise<HWCProductDetailed[]>;
    getProductById(id: number): Promise<HWCProductDetailed>;
    getProductBySlug(slug: string): Promise<HWCProductDetailed>;
}

export { type HWCProductBasic, type HWCProductDetailed, HeadlessWC, HeadlessWCCart };
