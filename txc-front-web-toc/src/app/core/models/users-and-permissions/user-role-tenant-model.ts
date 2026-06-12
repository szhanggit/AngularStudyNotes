export class UserRoleTenantTenantModel
{
    tenantId: string;
    tenantName:string;
}

export class UserRoleTenantRolesModel{
    roleId:number;
    roleDisplayName:string;
    tenatns: UserRoleTenantTenantModel[];
}

export class UserRoleTenantModel {
    userName: string;
    email:string;
    firstName:string;
    lastName:string;
    creationTime:Date;
    roles: UserRoleTenantTenantModel[];
}
