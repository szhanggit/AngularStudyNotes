import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  TableModel,
  ActionEvent,
  StatusProperty,
} from '../../models/table.model';

@Component({
  selector: 'lib-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLibComponent implements OnInit {
  @Input()
  set tableModel(value: TableModel) {
    this._tableModel = value;
    if (!this.rows.length || (this.rows.length && !value.tableData.length)) {
      this.rows = [...value.tableData];
    }
  }

  @Input() total: number = 0;
  @Input() pageSize: number = 0;
  @Input() page: number = 0;
  @Input() loading: boolean = true;

  @Input() statusEnum!: any;
  @Input() statusProperties: StatusProperty[] = [];
  @Input() noResultsMessage: string = 'No data to display'

  @Output() actionEvent = new EventEmitter<ActionEvent>();

  private _tableModel!: TableModel;
  get tableModel() {
    return this._tableModel;
  }

  rows: any[] = [];

  constructor() {}

  ngOnInit(): void {}

  onActionClicked(event: Event, row: any, eventName: string) {
    event.stopPropagation();
    this.actionEvent.emit({ rowData: row, eventName: eventName });
  }

  onPageChange(pageIndex: number) {
    // Temporary implementation only. Update during API integration
    this.rows = [
      ...this.tableModel.tableData
        .map((country, i) => ({ id: i + 1, ...country }))
        .slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize
        ),
    ];
  }
}
