import { TableModel } from '../dumb-models/table.model';

export interface TableDefinition {
    define(): TableModel;
}