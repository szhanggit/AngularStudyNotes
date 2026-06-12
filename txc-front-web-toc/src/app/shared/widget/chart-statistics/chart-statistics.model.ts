export interface ChartStatisticsItem {
    id: number,
    title: string;
    titleTooltipText: string;
    mainNumber: string | number;
    subNumber: string;
    subTitleClass: string;
    subIconClass: string;
    chartType: string;
    chartData: Array<number>;
    chartColor: string;
}