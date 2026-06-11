export const EXPIRY_SCHEMES = [
    {
        tenant: 'GL',
        isEdenred: true,
        expirySchemes: [
            {
                id: 20,
                description: "Within 90 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 21,
                description: "Within 120 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 22,
                description: "Within 180 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 2,
                description: "Within 3 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 3,
                description: "Within 6 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 18,
                description: "Within 12 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 4,
                description: "Within End Of 4 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 5,
                description: "Within End Of 3 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 6,
                description: "Within End Of 2 Months Expired After Activation",
                type: "End Of Months",
            },
            {
                id: 7,
                description: "Within End Of 1 Months Expired After Activation",
                type: "End Of Months",

            },
            {
                id: 1,
                description: "FixEndOfDay",
                type: "Fixed",

            },
            {
                id: 8,
                description: "No Expire Date",
                type: "No Expiration",

            },
            {
                id: 19,
                description: "Child Flexible Date Deferred More Than Master Expiry Date",
                type: "Child Flexible Date Depends On Master Expiry",
            },
        ]
    },
    {
        tenant: 'GL',
        isEdenred: false,
        expirySchemes: [
            {
                id: 9,
                description: "Flexible Date Deferred Within End Of 1 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 10,
                description: "Flexible Date Deferred Within End Of 2 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 11,
                description: "Flexible Date Deferred Within End Of 3 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 12,
                description: "Flexible Date Deferred Within End Of 4 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 13,
                description: "Flexible Date Deferred Within End Of 5 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 14,
                description: "Flexible Date Deferred Within End Of 6 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 15,
                description: "Flexible Date Deferred Within End Of 12 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 16,
                description: "ThirdParty FixEndOfDay",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 8,
                description: "No Expire Date",
                type: "No Expiration",

            },
            {
                id: 19,
                description: "Child Flexible Date Deferred More Than Master Expiry Date",
                type: "Child Flexible Date Depends On Master Expiry",

            }
        ]
    },
    {
        tenant: 'GR',
        isEdenred: true,
        expirySchemes: [
            {
                id: 1,
                description: "FixEndOfDay",
                type: "Fixed",

            },
            {
                id: 2,
                description: "Within 3 Months Expired After Activation",
                type: "Months",

            },
            {
                id: 3,
                description: "Within 6 Months Expired After Activation",
                type: "Months",

            },
            {
                id: 4,
                description: "Within End Of 4 Months Expired After Activation",
                type: "End Of Months",

            },
            {
                id: 5,
                description: "Within End Of 3 Months Expired After Activation",
                type: "End Of Months",

            },
            {
                id: 6,
                description: "Within End Of 2 Months Expired After Activation",
                type: "End Of Months",

            },
            {
                id: 7,
                description: "Within End Of 1 Months Expired After Activation",
                type: "End Of Months",

            },
            {
                id: 11,
                description: "Within End Of 5 Months Expired After Activation",
                type: "End Of Months",

            },
            {
                id: 12,
                description: "Within End Of 6 Months Expired After Activation",
                type: "End Of Months",

            },
            {
                id: 8,
                description: "No Expire Date",
                type: "No Expiration",

            },
            {
                id: 20,
                description: "Child Flexible Date Deferred More Than Master Expiry Date",
                type: "Child Flexible Date Depends On Master Expiry",

            }
        ]
    },
    {
        tenant: 'GR',
        isEdenred: false,
        expirySchemes: [
            {
                id: 9,
                description: "ThirdParty FixEndOfDay",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 13,
                description: "Flexible Date Deferred Within End Of 1 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 14,
                description: "Flexible Date Deferred Within End Of 2 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 15,
                description: "Flexible Date Deferred Within End Of 3 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 16,
                description: "Flexible Date Deferred Within End Of 4 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 17,
                description: "Flexible Date Deferred Within End Of 5 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 18,
                description: "Flexible Date Deferred Within End Of 6 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 19,
                description: "Flexible Date Deferred Within End Of 12 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party",

            },
            {
                id: 8,
                description: "No Expire Date",
                type: "No Expiration",

            },
            {
                id: 20,
                description: "Child Flexible Date Deferred More Than Master Expiry Date",
                type: "Child Flexible Date Depends On Master Expiry",

            }
        ]
    },
    {
        tenant: 'IN',
        isEdenred: true,
        expirySchemes: [
            {
                id: 1,
                description: "FixEndOfDay",
                type: "Fixed"
            },
            {
                id: 18,
                description: "Within 15 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 19,
                description: "Within 45 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 53,
                description: "Within 90 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 54,
                description: "Within 120 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 55,
                description: "Within 180 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 3,
                description: "Within 6 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 20,
                description: "Within 1 Month Expired After Activation",
                type: "Months"
            },
            {
                id: 21,
                description: "Within 2 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 2,
                description: "Within 3 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 50,
                description: "Within 4 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 51,
                description: "Within 5 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 45,
                description: "Within 7 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 46,
                description: "Within 8 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 47,
                description: "Within 9 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 48,
                description: "Within 10 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 49,
                description: "Within 11 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 10,
                description: "Within12MonthsExpiredAfterActivation",
                type: "Months"
            },
            {
                id: 27,
                description: "Within13MonthsExpiredAfterActivation",
                type: "Months"
            },
            {
                id: 7,
                description: "Within End Of 1 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 6,
                description: "Within End Of 2 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 5,
                description: "Within End Of 3 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 4,
                description: "Within End Of 4 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 42,
                description: "Within End Of 6 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 43,
                description: "Within End Of 10 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 44,
                description: "Within End Of 11 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 52,
                description: "Child Flexible Date Deferred More Than Master Expiry Date",
                type: "Child Flexible Date Depends On Master Expiry"
            }
        ]
    }, {
        tenant: 'IN',
        isEdenred: false,
        expirySchemes: [
            {
                id: 8,
                description: "ThirdParty FixEndOfDay",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 40,
                description: "Flexible Date Deferred Within 15 Days Expired After Activation",
                type: "Fixed Date Depends On Third Party Days"
            },
            {
                id: 41,
                description: "Flexible Date Deferred Within 45 Days Expired After Activation",
                type: "Fixed Date Depends On Third Party Days"
            },
            {
                id: 11,
                description: "Flexible Date Deferred Within End Of 1 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 12,
                description: "Flexible Date Deferred Within End Of 2 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 13,
                description: "Flexible Date Deferred Within End Of 3 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 14,
                description: "Flexible Date Deferred Within End Of 4 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 15,
                description: "Flexible Date Deferred Within End Of 5 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 16,
                description: "Flexible Date Deferred Within End Of 6 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 17,
                description: "Flexible Date Deferred Within End Of 12 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 22,
                description: "Flexible Date Deferred Within End Of 7 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 23,
                description: "Flexible Date Deferred Within End Of 8 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 24,
                description: "Flexible Date Deferred Within End Of 9 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 25,
                description: "Flexible Date Deferred Within End Of 10 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 26,
                description: "Flexible Date Deferred Within End Of 11 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 28,
                description: "Flexible Date Deferred Within 1 Month Expired After Activation",
                type: "Fixed Date Depends On Third Party Months"
            },
            {
                id: 29,
                description: "Flexible Date Deferred Within 2 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party Months"
            },
            {
                id: 30,
                description: "Flexible Date Deferred Within 3 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party Months"
            },
            {
                id: 31,
                description: "Flexible Date Deferred Within 4 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party Months"
            },
            {
                id: 32,
                description: "Flexible Date Deferred Within 5 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party Months"
            },
            {
                id: 33,
                description: "Flexible Date Deferred Within 6 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party Months"
            },
            {
                id: 34,
                description: "Flexible Date Deferred Within 7 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party Months"
            },
            {
                id: 35,
                description: "Flexible Date Deferred Within 8 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party Months"
            },
            {
                id: 36,
                description: "Flexible Date Deferred Within 9 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party Months"
            },
            {
                id: 37,
                description: "Flexible Date Deferred Within 10 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party Months"
            },
            {
                id: 38,
                description: "Flexible Date Deferred Within 11 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party Months"
            },
            {
                id: 39,
                description: "Flexible Date Deferred Within 12 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party Months"
            },
            {
                id: 52,
                description: "Child Flexible Date Deferred More Than Master Expiry Date",
                type: "Child Flexible Date Depends On Master Expiry"
            }
        ]
    }, {
        tenant: 'SG',
        isEdenred: true,
        expirySchemes: [
            {
                id: 1,
                description: "FixEndOfDay",
                type: "Fixed"
            },
            {
                id: 22,
                description: "Within 90 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 23,
                description: "Within 120 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 24,
                description: "Within 180 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 2,
                description: "Within 3 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 3,
                description: "Within 6 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 4,
                description: "Within End Of 4 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 5,
                description: "Within End Of 3 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 6,
                description: "Within End Of 2 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 7,
                description: "Within End Of 1 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 17,
                description: "Within End Of 5 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 18,
                description: "Within End Of 6 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 19,
                description: "Within End Of 9 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 20,
                description: "Within End Of 12 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 21,
                description: "Child Flexible Date Deferred More Than Master Expiry Date",
                type: "Child Flexible Date Depends On Master Expiry"
            }
        ]
    }, {
        tenant: 'SG',
        isEdenred: false,
        expirySchemes: [
            {
                id: 15,
                description: "ThirdParty FixEndOfDay",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 8,
                description: "Flexible Date Deferred Within End Of 1 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 9,
                description: "Flexible Date Deferred Within End Of 2 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 10,
                description: "Flexible Date Deferred Within End Of 3 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 11,
                description: "Flexible Date Deferred Within End Of 4 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 12,
                description: "Flexible Date Deferred Within End Of 5 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 13,
                description: "Flexible Date Deferred Within End Of 6 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 14,
                description: "Flexible Date Deferred Within End Of 12 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 21,
                description: "Child Flexible Date Deferred More Than Master Expiry Date",
                type: "Child Flexible Date Depends On Master Expiry"
            }
        ]
    }, {
        tenant: 'TW',
        isEdenred: true,
        expirySchemes: [
            {
                id: 8,
                description: "FixEndOfDay",
                type: "Fixed"
            },
            {
                id: 32,
                description: "Within 6 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 26,
                description: "Within 13 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 33,
                description: "Within 29 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 31,
                description: "Within 30 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 25,
                description: "Within 49 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 29,
                description: "Within 60 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 34,
                description: "Within 59 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 36,
                description: "Within 89 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 48,
                description: "Within 90 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 50,
                description: "Within 180 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 49,
                description: "Within 120 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 47,
                description: "Within 360 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 35,
                description: "Within 364 Days Expired After Activation",
                type: "Days"
            },
            {
                id: 17,
                description: "Within 3 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 18,
                description: "Within 6 Months Expired After Activation",
                type: "Months"
            },
            {
                id: 19,
                description: "Within End Of 4 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 20,
                description: "Within End Of 3 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 21,
                description: "Within End Of 2 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 22,
                description: "Within End Of 1 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 23,
                description: "Within End Of 5 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 24,
                description: "Within End Of 6 Months Expired After Activation",
                type: "End Of Months"
            },
            {
                id: 27,
                description: "Within 12 Months Expired After Activation",
                type: "End Of Months"
            }
        ]
    }, {
        tenant: 'TW',
        isEdenred: false,
        expirySchemes: [
            {
                id: 37,
                description: "ThirdParty FixEndOfDay",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 38,
                description: "Flexible Date Deferred Within End Of 1 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 39,
                description: "Flexible Date Deferred Within End Of 2 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 40,
                description: "Flexible Date Deferred Within End Of 3 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 41,
                description: "Flexible Date Deferred Within End Of 4 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 42,
                description: "Flexible Date Deferred Within End Of 5 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 43,
                description: "Flexible Date Deferred Within End Of 6 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 44,
                description: "Flexible Date Deferred Within End Of 12 Months Expired After Activation",
                type: "Fixed Date Depends On Third Party"
            },
            {
                id: 46,
                description: "Child Flexible Date Deferred More Than Master Expiry Date",
                type: "Child Flexible Date Depends On Master Expiry"
            }
        ]
    }
]