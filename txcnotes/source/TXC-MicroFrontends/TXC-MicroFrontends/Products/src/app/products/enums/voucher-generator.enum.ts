// the origin version of voucher generator
export enum VoucherGeneratorEnum {
    Edenred = 1,
    HiLife = 2,
}

// the modified version of voucher generator -- this one should be used
export enum ProductVoucherGeneratorEnum {
    None = 0,
    EdenredFixed = 1,
    ThirdPartyFixed = 2,
    EdenredFlexable = 4,
    ThirdPartyFlexable = 8,
}
