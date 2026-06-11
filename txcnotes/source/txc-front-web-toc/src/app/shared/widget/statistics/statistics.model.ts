export interface StatisticsItem {
    id: number,
    title: string,
    description: string,
    stats: string,
    icon: string,
    trendNumber: string,
    trendTime: string,
    trendIcon: string,
    trendTextClass?: string;
    bgClass?: string;
    badgeVariant?: string;
}
