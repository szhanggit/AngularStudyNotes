export class CreateUserModel {
    userName: string;
    roles: CreateUserRoles[];
}

export class CreateUserRoles {
    tenantBasicInfoId: number;
    roleId: number;
}
