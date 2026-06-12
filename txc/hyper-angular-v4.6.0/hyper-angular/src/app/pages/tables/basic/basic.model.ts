export interface PersonDetails {
    id: number;
    name: string;
    avatar: string;
    accountNo: string;
    birthdate: string;
    phone: string;
    isActive: boolean;
}

export interface ProductDetails {
    id: number;
    productName: string;
    price: number;
    amount: number;
    quantity: number;
    courier: string;
    status: string;
}