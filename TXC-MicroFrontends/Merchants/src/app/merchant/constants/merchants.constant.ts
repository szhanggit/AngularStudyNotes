export const MERCHANT_CONSTANTS = {
    AUTO_CREATE_REIMBURSEMENT_INTERVAL_TYPE :[
        {
            key: 0,
            value: 'Monthly'
        },
        {
            key: 1,
            value: 'Daily'
        }
    ],
    REIMBURSEMENT_TAX_TYPE: [
        {
            key: 0,
            value: 'NonTaxPrice'
        },
        {
            key: 1,
            value: 'TaxIncludedPrice'
        },
        {
            key: 2,
            value: 'NonTaxPriceByInt'
        },
        {
            key: 3,
            value: 'FaceValue'
        }
    ],
    REIMBURSEMENT_TYPE: [
        {
            key: 1,
            value: 'NoClear'
        },
        {
            key: 2,
            value: 'NeedPos'
        },
        {
            key: 3,
            value: 'MerchantFirst'
        },
    ],
    MERCHANT_AUTO_TYPE: [
        {
            key: 0,
            value: 'NoAuto'
        },
        {
            key: 1,
            value: 'AutoToCreate'
        },
        {
            key: 2,
            value: 'AutoToSubmit'
        }
    ],
    ISSUER_TYPE: [
        {
            key: 0,
            value: 'IssuerModel'
        },
        {
            key: 2,
            value: 'ResellerModel'
        },
        {
            key: 3,
            value: 'WhiteLabel'
        }
    ],
    IS_LEGACY_MERCHANT: [
        {
            key: 1,
            value: 'Is migrated from TX2'
        },
        {
            key: 0,
            value: 'Is created in TXC'
        }
    ],
    TENANTS: [
        {
            id: 2,
            name: 'IN'
        },
        {
            id: 5,
            name: 'GR'
        },
        {
            id: 6,
            name: 'SG'
        },
        {
            id: 7,
            name: 'TW'
        },
        {
            id: 9,
            name: 'GL'
        }
    ]
}