export class RefOperationResOpsDto {
    operationId: number;
    operationName: string;

    // checkbox
    isSelected: boolean;
}

export class RefResourceResOpsDto {
    resourceId: number;
    resourceName: string;
    operations: RefOperationResOpsDto[] = [];

    // needed for page behaviors
    operationDetails: string;
}

export class RefAppTntRoleResOpsDto {
    roleId: number;
    roleName: string;
    resources: RefResourceResOpsDto[] = [];
}