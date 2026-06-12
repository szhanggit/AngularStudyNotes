export class RoleModel {
    roleId: number;
    roleName: string;
    appId: number;
    tenantId: number;

    selected: boolean = false;
    roleExpiration?: Date;
}

export class RoleCategoryModel {
    category: string;
    roles: RoleModel[] = [];
}

export class RoleOperationModel {
    operationId: number;
    operationCode: string;
    operationName: string;
    isSelected: boolean;
}

export class RoleResourceModel {
    resourceName: string;
    operations: RoleOperationModel[] = [];
}

// Domain/Dto/RoleQryDto.cs
export class RoleQryDto {
    application: string;
    roleId: number;
    roleName: string;
    resource: string;
    operationDetails: string;
    status: boolean;
}

// Domain/Models/Response/GetRoleListQryRes.cs
export class GetRoleListQryRes {
    roles: RoleQryDto[] = [];
    totalCount: number;
}

