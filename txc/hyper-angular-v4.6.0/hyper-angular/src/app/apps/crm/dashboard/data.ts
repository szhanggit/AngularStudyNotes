// type
import { ChartStatisticsItem } from "src/app/shared/widget/chart-statistics/chart-statistics.model";
import { ToDoItem } from "src/app/shared/widget/todo/todo.model";
import { LeadItem, PerformanceListItem } from "../shared/crm.model";

export const chartStatisticsData: ChartStatisticsItem[] = [{
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
    subIconClass: "mdi mdi-arrow-down-bold",
    subTitleClass: "text-danger",
    chartType: "line",
    chartData: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54],
    chartColor: "#0acf97"
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
    chartColor: "#0acf97"
}];


export const topPerformanceData: PerformanceListItem[] = [{
    id: 1,
    name: "Jeremy Young",
    position: "Senior Sales Executive",
    leads: 187,
    deals: 154,
    tasks: 49
},
{
    id: 2,
    name: "Thomas Krueger",
    position: "Senior Sales Executive",
    leads: 235,
    deals: 127,
    tasks: 83
},
{
    id: 3,
    name: "Pete Burdine",
    position: "Senior Sales Executive",
    leads: 365,
    deals: 148,
    tasks: 62
},
{
    id: 4,
    name: "Mary Nelson",
    position: "Senior Sales Executive",
    leads: 753,
    deals: 159,
    tasks: 258
},
{
    id: 5,
    name: "Kevin Grove",
    position: "Senior Sales Executive",
    leads: 458,
    deals: 126,
    tasks: 73
}]


export const recentLeads: LeadItem[] = [{
    id: 1,
    name: "Risa Pearson",
    email: "richard.john@mail.com",
    profile: "assets/images/users/avatar-2.jpg",
    badge: {
        variant: "warning",
        text: "Cold lead",
    }
},
{
    id: 2,
    name: "Margaret D. Evans",
    email: "margaret.evans@rhyta.com",
    profile: "assets/images/users/avatar-3.jpg",
    badge: {
        variant: "danger",
        text: "Lost lead",
    }
},
{
    id: 3,
    name: "Bryan J. Luellen",
    email: "bryuellen@dayrep.com",
    profile: "assets/images/users/avatar-4.jpg",
    badge: {
        variant: "success",
        text: "Won lead",
    }
},
{
    id: 4,
    name: "Kathryn S. Collier",
    email: "collier@jourrapide.com",
    profile: "assets/images/users/avatar-5.jpg",
    badge: {
        variant: "warning",
        text: "Cold lead",
    }
},
{
    id: 5,
    name: "Timothy Kauper",
    email: "thykauper@rhyta.com",
    profile: "assets/images/users/avatar-1.jpg",
    badge: {
        variant: "warning",
        text: "Cold lead",
    }
},
{
    id: 6,
    name: "Zara Raws",
    email: "austin@dayrep.com",
    profile: "assets/images/users/avatar-6.jpg",
    badge: {
        variant: "success",
        text: "Won lead",
    }
}]


export const todoItems: ToDoItem[] = [{
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
