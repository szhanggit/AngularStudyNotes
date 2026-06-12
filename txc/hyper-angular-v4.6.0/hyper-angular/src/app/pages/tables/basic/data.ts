import { PersonDetails, ProductDetails } from "./basic.model";

const PERSONLIST: PersonDetails[] = [
    {
        id: 1,
        name: 'Risa D. Pearson',
        birthdate: 'July 24, 1970',
        avatar: 'assets/images/users/avatar-1.jpg',
        accountNo: 'AC336 508 2157',
        isActive: true,
        phone: '336-508-2157'
    },
    {
        id: 2,
        name: 'Ann C. Thompson',
        birthdate: 'January 25, 1980',
        avatar: 'assets/images/users/avatar-2.jpg',
        accountNo: 'SB646 473 2057',
        isActive: false,
        phone: '336-508-2157'
    },
    {
        id: 3,
        name: 'Paul J. Friend',
        birthdate: 'September 1, 1989',
        avatar: 'assets/images/users/avatar-3.jpg',
        accountNo: 'DL281 308 0793',
        isActive: true,
        phone: '336-508-2157'
    },
    {
        id: 4,
        name: 'Sean C. Nguyen',
        birthdate: 'May 3, 1996',
        avatar: 'assets/images/users/avatar-4.jpg',
        accountNo: 'CA269 714 6825',
        isActive: false,
        phone: '336-508-2157'
    }
];

const PRODUCTLIST: ProductDetails[] = [
    {
        id: 1,
        productName: 'ASOS Ridley High Waist',
        price: 79.49,
        amount: 6518.18,
        quantity: 82,
        courier: 'FedEx',
        status: 'Delivered'
    },
    {
        id: 2,
        productName: 'Marco Lightweight Shirt',
        price: 128.50,
        amount: 4750.50,
        quantity: 37,
        courier: 'DHL',
        status: 'Shipped'
    },
    {
        id: 3,
        productName: 'Half Sleeve Shirt',
        price: 39.99,
        amount: 2559.36,
        quantity: 64,
        courier: 'Bright',
        status: 'Order Received'
    },
    {
        id: 4,
        productName: 'Lightweight Jacket',
        price: 79.49,
        amount: 6518.18,
        quantity: 82,
        courier: 'Bright',
        status: 'Delivered'
    }
];

export { PERSONLIST, PRODUCTLIST };