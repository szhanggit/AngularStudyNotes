export class UpdateUserModel {
    UserBasicInfoId: number;
    userRoleTenants: UserRoleTenants[];
}

export class UserRoleTenants
{
    roleId: number;
    tenants: number[];
}
