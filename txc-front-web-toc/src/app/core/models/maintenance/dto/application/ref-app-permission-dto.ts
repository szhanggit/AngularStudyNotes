export class RefAppOperation {
    operationId: number;
    operationCode: string;
    operationName: string;
    isSelected: boolean;
}

export class RefAppPermissionDto {
    resourceName: string;
    operations: RefAppOperation[] = [];
}