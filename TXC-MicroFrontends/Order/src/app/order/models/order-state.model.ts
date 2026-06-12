export interface BaseState {
    page: number;
    pageSize: number;
    searchTerm: string;
}
export interface OrderState extends BaseState {
    orderStatus: number;
    createdFrom: string;
    createdTo: string;
    currentTab: number;
}