import { Component, ComponentFactoryResolver, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// type
import { AdvancedTableComponent, Column } from '../../../shared/advanced-table/advanced-table.component';
import { SortEvent } from '../../../shared/advanced-table/sortable.directive';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Seller } from '../shared/models';

// data
import { sellers } from '../shared/data';



@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.scss']
})
export class SellersComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  loading: boolean = false;
  selectAll: boolean = false;
  sellerList: Seller[] = [];
  pageSizeOptions: number[] = [10, 20, 50];
  columns: Column[] = [];

  @ViewChild('advancedTable') advancedTable!: AdvancedTableComponent;



  constructor (private sanitizer: DomSanitizer, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {

    this.pageTitle = [{ label: 'eCommerce', path: '/' }, { label: 'Sellers', path: '/', active: true }];

    // get customer data
    this._fetchData();

    // initialize advance table 
    this.initAdvancedTableData();
  }

  /**
   * fetches customer data
   */
  _fetchData(): void {
    this.sellerList = sellers;
  }



  /**
   *  initialize advance table columns
   */
  initAdvancedTableData(): void {
    this.columns = [
      {
        name: 'name',
        label: 'Seller',
        formatter: this.sellerNameFormatter.bind(this)
      },
      {
        name: 'store',
        label: 'Store',
        formatter: (seller: Seller) => seller.store
      },
      {
        name: 'product',
        label: 'Product',
        formatter: (seller: Seller) => `<span class="fw-semibold">${seller.products}</span>`
      },
      {
        name: 'balance',
        label: 'Balance',
        formatter: (seller: Seller) => seller.balance
      },
      {
        name: 'created_on',
        label: 'Created On',
        formatter: (seller: Seller) => seller.created_on
      },
      {
        name: 'Action',
        label: 'Action',
        width: 125,
        formatter: this.sellerActionFormatter.bind(this),
        sort: false
      }];
  }


  // formats name cell
  sellerNameFormatter(seller: Seller): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `
      <div class="table-user">
      <img src="${seller.image}" alt="table-user" class="me-2 rounded-circle">
       <a href="javascript:void(0);" class="text-body fw-semibold">${seller.name}</a>
       </div>
      `
    );
  }


  // action cell formatter
  sellerActionFormatter(seller: Seller): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
           <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-delete"></i></a>`
    )
  }

  // compares two cell value
  compare(v1: string | number, v2: string | number): number {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name,sort direction
   */
  sort(event: SortEvent): void {
    if (event.direction === '') {
      this.sellerList = sellers;
    } else {
      this.sellerList = [...this.sellerList].sort((a, b) => {
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
  matches(tableRow: Seller, term: string) {
    return tableRow.name?.toLowerCase().includes(term)
      || tableRow.store?.toLowerCase().includes(term)
      || String(tableRow.products)?.toLowerCase().includes(term)
      || tableRow.balance?.toLowerCase().includes(term)
      || tableRow.created_on?.toLowerCase().includes(term);
  }

  /**
   * Search Method
  */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = sellers;
      //  filter
      updatedData = updatedData.filter(seller => this.matches(seller, searchTerm));
      this.sellerList = updatedData;
    }

  }


}
