import { Component, OnInit } from '@angular/core';

// directive
import { SortEvent } from '../../../shared/advanced-table/sortable.directive';

// type
import { Column } from '../../../shared/advanced-table/advanced-table.component';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { AdvancedTable } from './advanced.model';

// data
import { tableData } from './data';

@Component({
  selector: 'app-tables-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  records: AdvancedTable[] = [];
  columns: Column[] = [];
  pageSizeOptions: number[] = [10, 25, 50, 100];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Tables', path: '/' }, { label: 'Advanced Tables', path: '/', active: true }];
    this._fetchData();
    this.initTableCofig();
  }

  /**
   * fetches table records
   */
  _fetchData(): void {
    this.records = tableData;
  }

  /**
   * initialize advanced table columns
   */
  initTableCofig(): void {
    this.columns = [
      {
        name: 'name',
        label: 'Name',
        formatter: (record: AdvancedTable) => record.name,
        width: 245,
      },
      {
        name: 'position',
        label: 'Position',
        formatter: (record: AdvancedTable) => record.position,
        width: 360,
      },
      {
        name: 'office',
        label: 'Office',
        formatter: (record: AdvancedTable) => record.office,
        width: 180
      },
      {
        name: 'age',
        label: 'Age',
        formatter: (record: AdvancedTable) => record.age,
      },
      {
        name: 'date',
        label: 'Date',
        formatter: (record: AdvancedTable) => record.date,
      },
      {
        name: 'salary',
        label: 'Salary',
        formatter: (record: AdvancedTable) => record.salary,

      }
    ];
  }

  // compares two cell values
  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name, sort direction
   */
  onSort(event: SortEvent): void {
    if (event.direction === '') {
      this.records = tableData;
    } else {
      this.records = [...this.records].sort((a, b) => {
        const res = this.compare(a[event.column], b[event.column]);
        return event.direction === 'asc' ? res : -res;
      });
    }
  }

  /**
 * Table Data Match with Search input
 * @param tables Table field value fetch
 * @param term Search the value
 */
  matches(tables: AdvancedTable, term: string) {
    return tables.name.toLowerCase().includes(term)
      || tables.position.toLowerCase().includes(term)
      || tables.office.toLowerCase().includes(term)
      || String(tables.age).includes(term)
      || tables.date.toLowerCase().includes(term)
      || tables.salary.toLowerCase().includes(term);
  }

  /**
   * Search Method
  */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = tableData;

      //  filter
      updatedData = updatedData.filter(record => this.matches(record, searchTerm));
      this.records = updatedData;
    }

  }


}
