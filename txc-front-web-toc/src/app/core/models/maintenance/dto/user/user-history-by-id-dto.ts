export class UserHistoryDetailsByIdDto {
    userName: string;
    editDateTime: Date;
    editor: string;
    tenant: string;
    application: string;
    actionDetails: string;
    accessDuration: string;
}

export class UserHistoryByIdDto {
    userHistoryDetails: UserHistoryDetailsByIdDto[] = [];
}