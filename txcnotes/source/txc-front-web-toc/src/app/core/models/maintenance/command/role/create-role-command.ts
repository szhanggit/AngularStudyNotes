export class CreateRoleCommand {
    roleName: string;
    isEnabled: boolean;
    tenantId: number;
    appId: number;
    description: string;
    operationIds: number[];
}