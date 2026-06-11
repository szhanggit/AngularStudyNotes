export interface TableModel {
    tableHeaders: TableHeader[];
    tableRows: TableRow[];
}

export interface TableHeader {
    headerName: string;
    headerId: string;
    hidden?: boolean;
}

export interface TableRow {
    data: TableData[];
}

export interface TableData {
    field?: string;
    value?: string | null;
    subValue?: string;
    hasSubValue?: boolean;
    isButton?: boolean;
    buttonType?: number;
}