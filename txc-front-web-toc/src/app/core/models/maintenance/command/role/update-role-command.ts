export class UpdateRoleCommand {
    roleId: number;
    roleName: string;
    description: string;
    isEnabled: boolean;
    tenantId: number;
    appId: number;
    removeOperationIds: number[];
    newOperationIds: number[];
}