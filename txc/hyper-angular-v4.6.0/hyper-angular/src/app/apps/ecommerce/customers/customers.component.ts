import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// type
import { AdvancedTableComponent, Column } from '../../../shared/advanced-table/advanced-table.component';
import { SortEvent } from '../../../shared/advanced-table/sortable.directive';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { Customer } from '../shared/models';

// data
import { customers } from '../shared/data';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  loading: boolean = false;
  selectAll: boolean = false;
  customerList: Customer[] = [];
  pageSizeOptions: number[] = [10, 20, 50];
  columns: Column[] = [];

  @ViewChild('advancedTable') advancedTable!: AdvancedTableComponent;

  constructor (private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    this.pageTitle = [{ label: 'eCommerce', path: '/' }, { label: 'Customers', path: '/', active: true }];

    // get customer data
    this._fetchData();


    // initialize advance table 
    this.initAdvancedTableData();
  }

  /**
   * fetches customer data
   */
  _fetchData(): void {
    this.customerList = customers;
  }

  /**
   * initialize advance table columns
   */
  initAdvancedTableData(): void {
    this.columns = [
      {
        name: 'name',
        label: 'Customers',
        formatter: this.customerNameFormatter.bind(this)
      },
      {
        name: 'phone',
        label: 'Phone',
        formatter: (customer: Customer) => customer.phone
      },
      {
        name: 'email',
        label: 'Email',
        formatter: (customer: Customer) => customer.email
      },
      {
        name: 'location',
        label: 'Location',
        formatter: (customer: Customer) => customer.location
      },
      {
        name: 'created_on',
        label: 'Created On',
        formatter: (customer: Customer) => customer.created_on
      },
      {
        name: 'status',
        label: 'Status',
        formatter: this.customerStatusFormatter.bind(this)
      },
      {
        name: 'Action',
        label: 'Action',
        formatter: this.customerActionFormatter.bind(this),
        sort: false
      }]
  }

  // formats name cell
  customerNameFormatter(customer: Customer): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `
      <div class="table-user">
      <img src="${customer.avatar}" alt="table-user" class="me-2 rounded-circle">
       <a href="javascript:void(0);" class="text-body fw-semibold">${customer.name}</a>
       </div>
      `
    );
  }

  // formats customer status
  customerStatusFormatter(customer: Customer): SafeHtml {
    if (customer.status == "Active") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="badge badge-success-lighten">Active</span>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="badge badge-danger-lighten">Blocked</span>`
      );
    }

  }

  // action cell formatter
  customerActionFormatter(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-eye"></i></a>
           <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
           <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-delete"></i></a>`
    );
  }

  /**
   * compares two cell value
   */
  compare(v1: string | number, v2: string | number): number {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name,direction
   */
  sort(event: SortEvent): void {
    if (event.direction === '') {
      this.customerList = customers;
    } else {
      this.customerList = [...this.customerList].sort((a, b) => {
        const res = this.compare(a[event.column], b[event.column]);
        return event.direction === 'asc' ? res : -res;
      });
    }
  }

  /**
 * Table Data Match with Search input
 * @param tableRow Table row
 * @param term Search the value
 */
  matches(tableRow: Customer, term: string) {
    return tableRow.name?.toLowerCase().includes(term)
      || tableRow.email?.toLowerCase().includes(term)
      || tableRow.phone?.toLowerCase().includes(term)
      || tableRow.location?.toLowerCase().includes(term)
      || tableRow.created_on?.toLowerCase().includes(term)
      || tableRow.status?.toLocaleLowerCase().includes(term);
  }

  /**
   * Search Method
  */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = customers;
      //  filter
      updatedData = updatedData.filter(customer => this.matches(customer, searchTerm));
      this.customerList = updatedData;
    }

  }


}
