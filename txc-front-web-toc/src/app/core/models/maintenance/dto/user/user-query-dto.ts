export class UserQryRoleAccessQryDto {
    roleName: string;
    roleDescription: string;
    roleActive: Date;
    roleExpired: Date;
    createdDate: Date;
    roleStatus: number;
    createdBy: string;
}

export class UserQryDto {
    userId: number;
    name: string;
    userName: string;
    email: string;
    appId: number;
    application: string;
    tenantId: number;
    tenant: string;
    userStatus: number;
    roles: UserQryRoleAccessQryDto[] = [];
}

export class GetAppUserAccessQryRes {
    appUserAccessList: UserQryDto[] = [];
    totalCount: number;
}