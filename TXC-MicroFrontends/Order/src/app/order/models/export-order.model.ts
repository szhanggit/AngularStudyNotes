export interface ExportOrder {
    id: number;
    isApiOrder: boolean;
    deliveryType: number;
    dateFrom: string;
    dateTo: string;
    isAllDate: boolean;
}