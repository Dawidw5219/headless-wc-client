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

interface HWCProduct {
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
    readonly products: HWCProduct[];
    readonly total: number;
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
}

export { HeadlessWC, HeadlessWCCart };
