// type
import { ChartStatisticsItem } from "src/app/shared/widget/chart-statistics/chart-statistics.model";
import { ChartStatistics2Item } from "src/app/shared/widget/chart-statistics2/chart-statistics2.model";
import { ChartItem } from "src/app/shared/widget/chart/chart.model";
import { RecentActivity } from "src/app/shared/widget/recent-activity/recent-activity.model";
import { StatisticsItem } from "src/app/shared/widget/statistics/statistics.model";
import { ToDoItem } from "src/app/shared/widget/todo/todo.model";
import { TransactionItem } from "src/app/shared/widget/transaction/transaction.model";

const statisticsData: StatisticsItem[] = [
    {
        id: 1,
        title: 'Revenue',
        description: 'Average Revenue',
        stats: '$6254',
        trendNumber: '7.00%',
        trendTime: 'Since last month',
        icon: 'mdi mdi-currency-btc bg-danger rounded-circle text-white',
        trendIcon: 'mdi mdi-arrow-down-bold',
        trendTextClass: 'text-white',
        badgeVariant: 'bg-info'
    },
    {
        id: 2,
        title: 'Growth',
        description: 'Growth',
        stats: '+ 30.56',
        trendNumber: '4.87%',
        trendTime: 'Since last month',
        icon: 'mdi mdi-pulse',
        trendIcon: 'mdi mdi-arrow-up-bold',
        trendTextClass: 'text-success'
    },
    {
        id: 3,
        title: 'Customers',
        description: 'Number of Customers',
        stats: ' 36,254',
        trendNumber: '5.27%',
        trendTime: 'Since last month',
        icon: 'mdi mdi-account-multiple bg-white text-success',
        trendIcon: 'mdi mdi-arrow-up-bold',
        bgClass: "bg-success",
        badgeVariant: "badge-light-lighten"
    },
    {
        id: 4,
        title: 'Revenue',
        description: 'Revenue',
        stats: '$10,245',
        trendNumber: '17.26%',
        trendTime: 'Since last month',
        icon: 'mdi mdi-currency-usd bg-light-lighten rounded-circle text-white',
        trendIcon: 'mdi mdi-arrow-up-bold',
        bgClass: "bg-primary",
        badgeVariant: "bg-info"
    }
];

const chartStatisticsData: ChartStatisticsItem[] = [{
    id: 1,
    title: "Campaign Sent",
    titleTooltipText: "Campaign Sent",
    mainNumber: 9184,
    subNumber: "3.27%",
    subIconClass: "mdi mdi-arrow-up-bold",
    subTitleClass: "text-success",
    chartType: "bar",
    chartData: [47, 45, 74, 32, 56, 31, 44, 33, 45, 19],
    chartColor: "#727cf5"
},
{
    id: 2,
    title: "New Leads",
    titleTooltipText: "New Leads",
    mainNumber: 3254,
    subNumber: "5.38%",
    subIconClass: "mdi mdi-arrow-up-bold",
    subTitleClass: "text-success",
    chartType: "line",
    chartData: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54],
    chartColor: "#727cf5"
},
{
    id: 3,
    title: "Deals",
    titleTooltipText: "Deals",
    mainNumber: 861,
    subNumber: "4.87%",
    subIconClass: " mdi mdi-arrow-up-bold",
    subTitleClass: "text-success",
    chartType: "bar",
    chartData: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14],
    chartColor: "#727cf5"
},
{
    id: 4,
    title: "Booked Revenue",
    titleTooltipText: "Booked Revenue",
    mainNumber: "$253k",
    subNumber: "11.7%",
    subIconClass: " mdi mdi-arrow-up-bold",
    subTitleClass: "text-success",
    chartType: "bar",
    chartData: [47, 45, 74, 14, 56, 74, 14, 11, 7, 39, 82],
    chartColor: "#727cf5"
}];

const chartData: ChartItem[] = [
    {
        id: 1,
        title: '$424,652',
        subTitle: 'Sales',
        chartType: 'area',
        chartData: [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46],
        chartColor: '#3688fc'
    },

    {
        id: 1,
        title: '$135,965',
        subTitle: 'Profits',
        chartType: 'bar',
        chartData: [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46],
        chartColor: '#0acf97'
    }
];

const todoItems: ToDoItem[] = [{
    id: 1,
    text: 'Build an angular app',
    status: 'completed'
},
{
    id: 2,
    text: 'Create new version 3.0',
    status: 'inprogress'
},
{
    id: 3,
    text: 'Hehe!! This looks cool!',
    status: 'inprogress'
},
{
    id: 4,
    text: 'Testing??',
    status: 'completed'
},
{
    id: 5,
    text: 'Creating component page',
    status: 'inprogress'
},
{
    id: 6,
    text: 'Build a js based app',
    status: 'completed'
},
{
    id: 7,
    text: 'Design One page theme',
    status: 'inprogress'
}]

const recentActivities: RecentActivity[] = [{
    id: 1,
    title: "You sold an item",
    timelineIcon: "mdi mdi-upload",
    variant: "info",
    text: "Paul Burgess just purchased",
    mainText: '"Hyper - Admin Dashboard!"',
    time: "5 minutes ago"
}, {
    id: 2,
    title: "Product on the Bootstrap Market",
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
}]

const transactionData: TransactionItem[] = [
    {
        id: 1,
        title: 'Purchased Hyper Admin Template',
        icon: 'mdi mdi-arrow-collapse-up',
        amount: 489.30,
        variant: 'danger',
        transactionDate: 'Today'
    },
    {
        id: 2,
        title: 'Payment received Bootstrap Marketplace',
        icon: 'mdi mdi-arrow-collapse-down',
        amount: 1578.54,
        variant: 'success',
        transactionDate: 'Yesterday'
    },
    {
        id: 3,
        title: 'Freelance work - Shane',
        icon: 'mdi mdi-arrow-collapse-down',
        amount: 247.5,
        variant: 'success',
        transactionDate: '16 Sep 2018'
    },
    {
        id: 4,
        title: 'Hire new developer for work',
        icon: 'mdi mdi-arrow-collapse-up',
        amount: 185.14,
        variant: 'danger',
        transactionDate: '09 Sep 2018'
    },
    {
        id: 5,
        title: 'Money received from paypal',
        icon: 'mdi mdi-arrow-collapse-down',
        amount: 185.14,
        variant: 'success',
        transactionDate: '28 Aug 2018'
    },
    {
        id: 6,
        title: 'Freelance work - Shane',
        icon: 'mdi mdi-arrow-collapse-down',
        amount: 247.5,
        variant: 'success',
        transactionDate: '16 Sep 2018'
    },
    {
        id: 7,
        title: 'Hire new developer for work',
        icon: 'mdi mdi-arrow-collapse-up',
        amount: 185.14,
        variant: 'danger',
        transactionDate: '09 Sep 2018'
    },
    {
        id: 8,
        title: 'Money received from paypal',
        icon: 'mdi mdi-arrow-collapse-down',
        amount: 185.14,
        variant: 'success',
        transactionDate: '28 Aug 2018'
    }

]

const chartStatistics2Data: ChartStatistics2Item[] = [
    {
        id: 1,
        title: 'Sales Summary',
        mainNumber: '259',
        chartType: 'line',
        chartData: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21],
        chartColor: '#734cea',
        lastMonthNumber: '358',
        currentMonthNumber: '194'
    },
    {
        id: 2,
        title: 'Revenue',
        mainNumber: '$6,254',
        chartType: 'bar',
        chartData: [12, 14, 2, 47, 32, 44, 14, 55, 41, 69],
        chartColor: '#34bfa3',
        lastMonthNumber: '$781.12',
        currentMonthNumber: '$128.2'
    },
    {
        id: 3,
        title: 'Active Users',
        mainNumber: '324',
        chartType: 'line',
        chartData: [47, 45, 74, 32, 56, 31, 44, 33, 45, 19],
        chartColor: '#f4516c',
        lastMonthNumber: '+15%',
        currentMonthNumber: '-6.87%'
    },
    {
        id: 4,
        title: 'Expense Summary',
        mainNumber: '$4,745.2',
        chartType: 'bar',
        chartData: [15, 75, 47, 65, 14, 32, 19, 54, 44, 61],
        chartColor: '#00c5dc',
        lastMonthNumber: '$7814',
        currentMonthNumber: '$4782.8'
    }
];


export { statisticsData, chartStatisticsData, chartData, todoItems, recentActivities, transactionData, chartStatistics2Data };
