export interface ActionEvent {
  rowData: any;
  eventName: string;
}

export interface TableModel {
  tableHeaders: TableHeader[];
  // TODO: use generics
  tableData: any[];
  tableClass?: string;
}

export interface TableHeader {
  headerName: string;
  headerId: string;
  hidden?: boolean;
  style?: string;
  status?: boolean;
  actionConfig?: TableActionConfig[];
  clickable?: boolean;
  tooltip?: boolean;
  spanStyle?: string;
  fieldConfig?: string[];
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

export interface TableActionConfig {
  id: any;
  buttonType: 'basic' | 'icon' | 'basicWithIcon';
  eventName: string;
  iconName?: string;
  buttonName?: string;
  style?: string;
  tooltipLabel?: string
}

// for status column
export interface StatusProperty {
  values: any[];
  textColor: string;
  bgColor: string;
}

export interface ActionEvent {
  rowData: any;
  eventName: string;
}
