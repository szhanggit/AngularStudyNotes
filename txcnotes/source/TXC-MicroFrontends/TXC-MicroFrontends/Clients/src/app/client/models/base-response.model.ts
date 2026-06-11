export interface BaseResponse {
    data: any;
    message: string;
    success: boolean;
}

export interface BaseResponseQ {
    Data: any;
    Message: string;
    TotalCount: number;
    IsSuccess: boolean;
}