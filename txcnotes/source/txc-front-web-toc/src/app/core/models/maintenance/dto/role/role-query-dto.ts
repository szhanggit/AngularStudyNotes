export class ResourceQryItemsDto {
    resourceId: number;
    resourceName: string;
    operationDetails: string;
}

export class RoleQryDto {
    application: string;
    roleId: number;
    roleName: string;
    isAdmin:boolean;
    tenantId: number;
    status: boolean;
    resourceItems: ResourceQryItemsDto[];
}

export class GetRoleListQryRes {
    roles: RoleQryDto[] = [];
    totalCount: number;
}
