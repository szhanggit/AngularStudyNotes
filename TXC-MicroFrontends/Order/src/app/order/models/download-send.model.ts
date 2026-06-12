export interface DownloadVoucherExcelResponse {
    file: string;
    fileName: string;
    password: string;
    contentType: string;
}

export interface DownloadVoucherRequestBody {
    orderId: number,
    orderMode: number,
}

export interface SendVoucherRequestBody {
    email: string;
    orderId: number;
}

export interface ClientContact {
    clientId: number;
    email: string;
    name: string;
}