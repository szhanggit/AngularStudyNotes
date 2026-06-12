export interface Product {
    id: number;
    name: string;
    category: string;
    image: string;
    added_date: string;
    rating: number;
    price: number;
    quantity: number;
    status: boolean;

    [key: string]: number | string | boolean;
}


export interface Order {
    id: number;
    order_id: string;
    order_date: string;
    order_time: string;
    payment_status: string;
    total: string;
    payment_method: string;
    order_status: string;

    [key: string]: number | string;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    location: string;
    created_on: string;
    status: string;
    avatar: string;

    [key: string]: number | string;

}

export interface Seller {
    id: number;
    name: string;
    store: string;
    products: number;
    created_on: string;
    balance: string;
    image: string;

    [key: string]: number | string;

}

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    total: number;
}
interface OrderSummary {
    id: number;
    description: string;
    price: number;
}

interface ShippingAddress {
    provider: string;
    address_1: string;
    address_2: string;
    phone: string;
    mobile: string;
}

interface Billing {
    type: string;
    provider: string;
    valid: string;
}

interface DeliveryInfo {
    provider: string;
    order_id: string;
    payment_mode: string;
}

export interface OrderDetails {
    id: string;
    order_status?: string;
    items: OrderItem[];
    summary: OrderSummary[];
    shipping: ShippingAddress;
    billing: Billing;
    delivery: DeliveryInfo;
}

export interface CartItem {
    id: number;
    image: string;
    name: string;
    size: string;
    color: string;
    price: number;
    qty: number;
    total: number;
}

export interface CartSummary {
    gross_total?: number;
    discount?: number;
    shipping_charge?: number;
    tax?: number;
    net_total?: number;
};

