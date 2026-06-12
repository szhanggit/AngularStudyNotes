export interface UpdateBatchFootnoteRequest {
    productIdList: number[];
    footnote: string;
    textValue: string;
    applyToOrder: boolean;
}