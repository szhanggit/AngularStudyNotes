export interface GetVoucherNumberRuleAlgorithmResponse {
    data: {
        algorithmDto: {id:number, name:string}[]
    },
    message: string;
    success: boolean;
}

export interface GetVoucherNumberRuleVoucherGeneratorResponse {
    data: {
        voucherGeneratorDto: { id: number, description: string }[]
    },
    message: string;
    success: boolean;
}

export interface GetVoucherNumberRulePinCodeResponse {
    data: {
        pinCodeDto: { id: number, description: string }[]
    },
    message: string;
    success: boolean;
}

export interface GetVoucherNumberRuleBarCodeResponse {
    data: {
        barCodeDto: { id: number, description: string }[]
    },
    message: string;
    success: boolean;
}


