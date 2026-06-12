export class UserRowItemTenant{
    tenantId: number;
    tenantName: string;
}

export class UserRowItemRoleModel{
    roleId: number;
    roleDisplayName: string;
}

export class UserRowItemModel
{
    userId: number;
    userName: string;
    email: string;
    firstName: string;
    lastName:string;
    creationTime: Date;
    role: UserRowItemRoleModel;
    tenants: UserRowItemTenant[];
}

export class GetUserListModel {
    users: UserRowItemModel[];
    totalCount: number;
}
