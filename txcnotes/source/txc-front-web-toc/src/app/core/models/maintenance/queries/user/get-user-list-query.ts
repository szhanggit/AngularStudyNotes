export class GetUserListQry {
    searchKey: string;
    tenantId: number;
    appId: number;
    roleId: number[] = [];
    roleStatus: number;
    userStatus: number;

    pageNumber: number;
    rowCount: number;
}