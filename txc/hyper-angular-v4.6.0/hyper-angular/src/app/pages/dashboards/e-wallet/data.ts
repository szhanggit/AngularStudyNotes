import { ChartStatisticsItem, MoneyHistory, Transaction, WatchlistItem } from "./e-wallet.model";

const STATISTICSDATA: ChartStatisticsItem[] = [
    {
        icon: 'mdi mdi-currency-btc',
        stats: 12500,
        trend: 45,
        currencyType: 'BTC',
        currencyAmount: 48781.20,
        chartType: 'line',
        colors: ['#727cf5'],
        data: [25, 33, 28, 35, 30, 40]
    },
    {
        icon: 'mdi mdi-currency-cny',
        stats: 9250,
        trend: 32,
        currencyType: 'CNY',
        currencyAmount: 0.6,
        chartType: 'bar',
        colors: ['#727cf5'],
        data: [25, 44, 12, 36, 9, 54, 25, 66, 41, 89, 63]
    },
    {
        icon: 'mdi mdi-currency-eth',
        stats: 12500,
        trend: 60,
        currencyType: 'ETH',
        currencyAmount: 3783.68,
        chartType: 'line',
        colors: ['#727cf5'],
        data: [25, 33, 28, 35, 30, 40]
    }
];

const WATCHLIST: WatchlistItem[] = [
    {
        icon: 'mdi mdi-currency-btc',
        variant: 'warning',
        title: 'Bitcoin (BTC)',
        amount: 48665.80,
        trendValue: 10,
        trendStatus: 'up',
    },
    {
        icon: 'mdi mdi-currency-ngn',
        variant: 'success',
        title: 'Nigerian naira (NGN)',
        amount: 0.0024,
        trendValue: 12,
        trendStatus: 'down',
    },
    {
        icon: 'mdi mdi-currency-gbp',
        variant: 'danger',
        title: 'Pound sterling (GBP)',
        amount: 1.33,
        trendValue: 15,
        trendStatus: 'up',
    },
    {
        icon: 'mdi mdi-currency-ils',
        variant: 'primary',
        title: 'Israeli shekels (ILS)',
        amount: 0.32,
        trendValue: 11,
        trendStatus: 'up',
    },
    {
        icon: 'mdi mdi-currency-kzt',
        variant: 'info',
        title: 'Kazakhstani tenge (KZT)',
        amount: 0.0023,
        trendValue: 10,
        trendStatus: 'down',
    },
    {
        icon: 'mdi mdi-currency-rub',
        variant: 'dark',
        title: 'Russian ruble (RUB)',
        amount: 0.014,
        trendValue: 18,
        trendStatus: 'up',
    },
];

const MONEYHISTORY: MoneyHistory[] = [
    {
        title: 'Income',
        icon: 'mdi mdi-arrow-up-bold-outline',
        amount: 276548,
        variant: 'primary'
    },
    {
        title: 'Expenses',
        icon: 'mdi mdi-arrow-down-bold-outline',
        amount: 50216,
        variant: 'danger'
    },
    {
        title: 'Transfar',
        icon: 'mdi mdi-swap-horizontal',
        amount: 98100,
        variant: 'success'
    }
];


const TRANSACTIONS: Transaction[] = [
    {
        avatar: 'assets/images/users/avatar-1.jpg',
        name: 'Adam Baldwin',
        date: 'Jan 01, 2022',
        status: 'Incoming',
        amount: 2586.60,
    },
    {
        avatar: 'assets/images/users/avatar-2.jpg',
        name: 'Peter Wallace',
        date: 'Jan 18, 2022',
        status: 'Outgoing',
        amount: 1250.48,
    },
    {
        avatar: 'assets/images/users/avatar-3.jpg',
        name: 'Jacob Dunn',
        date: 'Feb 05, 2022',
        status: 'Incoming',
        amount: 18400.00,
    },
    {
        avatar: 'assets/images/users/avatar-4.jpg',
        name: 'Terry Adams',
        date: 'Feb 13, 2022',
        status: 'In Progress',
        amount: 9646.20,
    },
    {
        avatar: 'assets/images/users/avatar-5.jpg',
        name: 'Jason Stovall',
        date: 'Mar 02, 2022',
        status: 'Outgoing',
        amount: 10285.80,
    },
];

export { STATISTICSDATA, WATCHLIST, MONEYHISTORY, TRANSACTIONS };