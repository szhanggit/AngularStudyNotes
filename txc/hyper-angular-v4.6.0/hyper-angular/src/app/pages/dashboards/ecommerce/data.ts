// type
import { RecentActivity } from "src/app/shared/widget/recent-activity/recent-activity.model";
import { StatisticsItem } from "src/app/shared/widget/statistics/statistics.model"
import { SellProductItem } from "./ecommerce.model";


export const sellData: SellProductItem[] = [{
    id: 1,
    productName: "ASOS Ridley High Waist",
    sellDate: "07 April 2018",
    price: 79.49,
    quantity: 82,
    amount: 6518.18
},
{
    id: 2,
    productName: "Marco Lightweight Shirt",
    sellDate: "25 March 2018",
    price: 128.50,
    quantity: 37,
    amount: 4757.50
},
{
    id: 3,
    productName: "Half Sleeve Shirt",
    sellDate: "17 March 2018",
    price: 39.99,
    quantity: 64,
    amount: 2559.36
},
{
    id: 4,
    productName: "Lightweight Jacket",
    sellDate: "12 March 2018",
    price: 20.00,
    quantity: 184,
    amount: 3680.00
},
{
    id: 5,
    productName: "Marco Shoes",
    sellDate: "05 March 2018",
    price: 28.49,
    quantity: 69,
    amount: 1965.81
}]



export const statisticsData1: StatisticsItem[] = [{
    id: 1,
    title: 'Customers',
    description: 'Number of Customers',
    stats: ' 36,254',
    trendNumber: '5.27%',
    trendTime: 'Since last month',
    icon: 'mdi mdi-account-multiple',
    trendIcon: 'mdi mdi-arrow-up-bold',
    trendTextClass: 'text-success'
},
{
    id: 2,
    title: 'Orders',
    description: 'Number of Orders',
    stats: '5,543',
    trendNumber: '1.21%',
    trendTime: 'Since last month',
    icon: 'mdi mdi-cart-plus',
    trendIcon: 'mdi mdi-arrow-down-bold',
    trendTextClass: 'text-danger'
}];

export const statisticsData2: StatisticsItem[] = [
    {
        id: 3,
        title: 'Revenue',
        description: 'Average Revenue',
        stats: '$6,254',
        trendNumber: '7.00%',
        trendTime: 'Since last month',
        icon: 'mdi mdi-currency-usd',
        trendIcon: 'mdi mdi-arrow-down-bold',
        trendTextClass: 'text-danger'
    },
    {
        id: 4,
        title: 'Growth',
        description: 'Growth',
        stats: '+ 30.56%',
        trendNumber: '4.87%',
        trendTime: 'Since last month',
        icon: 'mdi mdi-pulse',
        trendIcon: 'mdi mdi-arrow-up-bold',
        trendTextClass: 'text-success'
    }
];

export const recentActivities: RecentActivity[] = [{
    id: 1,
    title: "You sold an item",
    timelineIcon: "mdi mdi-upload",
    variant: "info",
    text: "Paul Burgess just purchased",
    mainText: '"Hyper - Admin Dashboard!"',
    time: "5 minutes ago"
}, {
    id: 2,
    title: "You sold an item",
    timelineIcon: "mdi mdi-airplane",
    variant: "primary",
    text: "Dave Gamache added",
    mainText: '"Admin Dashboard"',
    time: "30 minutes ago"
},
{
    id: 3,
    title: "Robert Delaney",
    timelineIcon: "mdi mdi-airplane",
    variant: "info",
    text: "Send you message",
    mainText: '"Are you there?"',
    time: "2 hours ago"
},
{
    id: 4,
    title: "Audrey Tobey",
    timelineIcon: "mdi mdi-upload",
    variant: "primary",
    text: "Uploaded a photo",
    mainText: '"Error.jpg"',
    time: "14 hours ago"
},
{
    id: 5,
    title: "You sold an item",
    timelineIcon: "mdi mdi-upload",
    variant: "info",
    text: "Paul Burgess just purchased",
    mainText: '"Hyper - Admin Dashboard!"',
    time: "5 minutes ago"
}, {
    id: 6,
    title: "You sold an item",
    timelineIcon: "mdi mdi-airplane",
    variant: "primary",
    text: "Dave Gamache added",
    mainText: '"Admin Dashboard"',
    time: "30 minutes ago"
},
{
    id: 7,
    title: "Robert Delaney",
    timelineIcon: "mdi mdi-airplane",
    variant: "info",
    text: "Send you message",
    mainText: '"Are you there?"',
    time: "2 hours ago"
},
{
    id: 8,
    title: "Audrey Tobey",
    timelineIcon: "mdi mdi-upload",
    variant: "primary",
    text: "Uploaded a photo",
    mainText: '"Error.jpg"',
    time: "14 hours ago"
}]