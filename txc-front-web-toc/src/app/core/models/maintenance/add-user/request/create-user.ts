export class CreateUserRoleReq {
    roleId: number;
    roleExpiration: Date;
}

export class RefAppTenantRoleDto {
    userRoleId: number;
    roleId: number;
    roleName: string;
    roleExpiration: Date;
    isSelected: boolean;

    setCustomExpiry: boolean;
}

export class RefAppTenantDto {
    uatId: number;
    appId: number;
    tenantId: number;
    expiration: Date;
    isRemove: boolean;
    roles: RefAppTenantRoleDto[] = [];
}

export class CreateUserAppTenant {
    tenantId: number;
    appId: number;
    specifyExpiration: boolean;
    expiration: Date;
    roles: CreateUserRoleReq[] = [];
    rolesRef: RefAppTenantRoleDto[] = [];
}

export class CreateUser {
    userName: string;
    isAdUser: boolean;
    applicationTenants: CreateUserAppTenant[] = [];
}