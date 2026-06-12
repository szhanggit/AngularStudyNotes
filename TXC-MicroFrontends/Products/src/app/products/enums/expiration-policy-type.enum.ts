export enum ExpirationPolicyTypeEnum {
    All = 0,
    NoExpiration,
    Fixed,
    Days,
    Monthes,
    EndOfMonthes,
    FixedDateDependsOnThirdParty,
    FixedDateDependsOnThirdPartyMonths,
    FixedDateDependsOnThirdPartyDays,
    ChildFlexibleDateDependsOnMasterExpiry,
    ChildFixedDateDependsOnMasterExpiry
}