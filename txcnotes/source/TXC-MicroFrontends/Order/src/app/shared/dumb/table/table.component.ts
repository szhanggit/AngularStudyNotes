import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableData, TableModel } from '../../models/dumb-models/table.model';
import { TableButtonType } from '../../enums/table-button-type.enum';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() tableModel!: TableModel;
  @Input() greyHeader = false;
  @Input() isStripedTable = true;
  @Input() showScrollInsideTable = false;
  @Output() deleteClicked = new EventEmitter<{
    row: TableData[];
    index: number;
  }>();
  @Output() editClicked = new EventEmitter<{
    row: TableData[];
    index: number;
  }>();

  get buttonType(): typeof TableButtonType {
    return TableButtonType;
  }

  onDeleteClicked(row: TableData[], rowIndex: number) {
    this.tableModel.tableRows.splice(rowIndex, 1);
    this.deleteClicked.emit({ row: row, index: rowIndex });
  }

  onEditClicked(row: TableData[], rowIndex: number) {
    this.editClicked.emit({ row: row, index: rowIndex });
  }
}
