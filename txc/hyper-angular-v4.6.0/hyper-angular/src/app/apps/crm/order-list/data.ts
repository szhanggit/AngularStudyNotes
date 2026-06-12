import { Order } from "../shared/crm.model";

const ORDERS: Order[] = [
    {
        id: 1,
        orderId: '#CM9708',
        customer: {
            avatar: 'assets/images/users/avatar-1.jpg',
            name: 'Jerry Geiger',
        },
        project: 'Landing Page',
        address: {
            country: 'New York',
            city: 'Meadow Lane Oakland'
        },
        orderDate: '01 January 2022',
        orderStatus: 'In Progress',
    },
    {
        id: 2,
        orderId: '#CM9707',
        customer: {
            avatar: 'assets/images/users/avatar-2.jpg',
            name: 'Adam Thomas'
        },
        project: 'Client Project (Sktech)',
        address: {
            country: 'Canada',
            city: 'Bagwell Avenue Ocala'
        },
        orderDate: '02 January 2022',
        orderStatus: 'Complete',
    },
    {
        id: 3,
        orderId: '#CM9706',
        customer: {
            avatar: 'assets/images/users/avatar-3.jpg',
            name: 'Sara Lewis'
        },
        project: 'Admin Dashboard',
        address: {
            country: 'Denmark',
            city: 'Washburn Baton Rouge'
        },
        orderDate: '03 January 2022',
        orderStatus: 'Pending',
    },
    {
        id: 4,
        orderId: '#CM9705',
        customer: {
            avatar: 'assets/images/users/avatar-4.jpg',
            name: 'Myrtle Johnson',
        },
        project: 'Landing Page (Figma)',
        address: {
            country: 'Brazil',
            city: 'Nest Lane Olivette'
        },
        orderDate: '04 January 2022',
        orderStatus: 'Delivered',
    },
    {
        id: 5,
        orderId: '#CM9704',
        customer: {
            avatar: 'assets/images/users/avatar-5.jpg',
            name: 'Bryan Collier',
        },
        project: 'App Landing Page',
        address: {
            country: 'Mexico',
            city: 'Larry San Francisco'
        },
        orderDate: '05 January 2022',
        orderStatus: 'In Progress',
    },
    {
        id: 6,
        orderId: '#CM9703',
        customer: {
            avatar: 'assets/images/users/avatar-6.jpg',
            name: 'Joshua Moody',
        },
        project: 'CRM Admin pages',
        address: {
            country: 'Russia',
            city: 'Oak Drive Mobile'
        },
        orderDate: '06 January 2022',
        orderStatus: 'Complete',
    },
    {
        id: 7,
        orderId: '#CM9702',
        customer: {
            avatar: 'assets/images/users/avatar-7.jpg',
            name: 'John Clune'
        },
        project: 'Ecommerce Dashboard',
        address: {
            country: 'Manitoba',
            city: 'Oxford Court Amory'
        },
        orderDate: '07 January 2022',
        orderStatus: 'Delivered',
    },
    {
        id: 8,
        orderId: '#CM9701',
        customer: {
            avatar: 'assets/images/users/avatar-8.jpg',
            name: 'Jamie Romero'
        },
        project: 'Logo Design',
        address: {
            country: 'Nova Scotia',
            city: 'Lane New Market'
        },
        orderDate: '08 January 2022',
        orderStatus: 'Pending',
    },
    {
        id: 9,
        orderId: '#CM9700',
        customer: {
            avatar: 'assets/images/users/avatar-9.jpg',
            name: 'Clint Percival'
        },
        project: 'PHP Project',
        address: {
            country: 'Manitoba',
            city: 'Wilson Avenue Dallas'
        },
        orderDate: '09 January 2022',
        orderStatus: 'Delivered',
    },
    {
        id: 10,
        orderId: '#CM9699',
        customer: {
            avatar: 'assets/images/users/avatar-10.jpg',
            name: 'Donna Lynch'
        },
        project: 'Landing Section',
        address: {
            country: 'Yukon',
            city: 'Avenue Johnson country'
        },
        orderDate: '10 January 2022',
        orderStatus: 'Complete',
    },
];

export { ORDERS };