export class RoleOperationQryByIdDto {
    operationId: number;
    operationName: string;
    permissionId: number;
    isSelected: boolean;

    // needed for storing remove/new operation Ids
    existing: boolean;
}

export class RoleResourceQryByIdDto {
    resourceName: string;
    operations: RoleOperationQryByIdDto[] = [];
    
    // needed for page behaviors
    operationDetails: string;
}

export class RoleQryByIdDto {
    roleId: number;
    roleName: string;
    description: string;
    status: boolean;
    tenantId: number;
    appId: number;
    resources: RoleResourceQryByIdDto[] = [];

    // needed for page behaviors
    tenant: string;
    application: string;
}