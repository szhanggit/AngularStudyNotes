import { ChartType } from "ng-apexcharts";

export interface ChartStatisticsItem {
    icon: string,
    stats: number,
    trend: number,
    currencyType: string,
    currencyAmount: number,
    chartType: ChartType,
    colors: string[],
    data: number[],
    // strokeWidth: number,
}

export interface WatchlistItem {
    title: string;
    amount: number;
    icon: string;
    variant: string;
    trendValue: number;
    trendStatus: 'up' | 'down';
}

export interface MoneyHistory {
    title: string;
    amount: number;
    variant: string;
    icon: string;
}

export interface Transaction {
    avatar: string;
    name: string;
    date: string;
    status: string;
    amount: number;
}