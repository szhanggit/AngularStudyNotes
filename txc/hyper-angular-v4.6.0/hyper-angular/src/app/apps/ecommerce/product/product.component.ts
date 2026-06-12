import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

// type
import { AdvancedTableComponent, Column } from '../../../shared/advanced-table/advanced-table.component';
import { SortEvent } from '../../../shared/advanced-table/sortable.directive';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { Product } from '../shared/models';

// data
import { products } from '../shared/data';

@Component({
  selector: 'app-ecommerce-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {

  pageTitle: BreadcrumbItem[] = [];
  productData!: Product[];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 5;
  selectAll: boolean = false;
  loading: boolean = false;
  columns: Column[] = [];


  @ViewChild('advancedTable') advancedTable!: AdvancedTableComponent;

  constructor (private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }



  ngOnInit(): void {

    this.pageTitle = [{ label: 'eCommerce', path: '/' }, { label: 'Products', path: '/', active: true }];
    // get product data
    this._fetchData();
    // initialize advance table 
    this.initAdvancedTableData();
  }

  ngAfterViewInit(): void {
  }

  /**
   * initialize advance table columns
   */
  initAdvancedTableData(): void {
    this.columns = [
      {
        name: 'name',
        label: 'Product',
        formatter: this.productDetailsFormatter.bind(this),
      },
      {
        name: 'category',
        label: 'Category',
        formatter: (product: Product) => product.category,
      },
      {
        name: 'added_date',
        label: 'Added Date',
        formatter: (product: Product) => product.added_date,
      },
      {
        name: 'price',
        label: 'Price',
        formatter: (product: Product) => product.price,
      },
      {
        name: 'quantity',
        label: 'Quantity',
        formatter: (product: Product) => product.quantity,
      },
      {
        name: 'status',
        label: 'Status',
        formatter: this.productStatusFormatter.bind(this),
      },
      {
        name: 'action',
        label: 'Action',
        formatter: this.productActionFormatter.bind(this),
        sort: false
      }
    ]
  }


  /**
   *  fetches product data
   */
  _fetchData(): void {
    this.productData = products;
  }

  /**
   * handles operations that need to be performed after loading table
   */
  handleTableLoad(): void {
    // product cell
    document.querySelectorAll('.product').forEach((e) => {
      e.addEventListener("click", () => {
        this.router.navigate(['../productdetails'], { relativeTo: this.route, queryParams: { id: e.id } })
      });
    })
  }


  // table product formatter
  productDetailsFormatter(product: Product): SafeHtml {
    let productCell: string = `
          <img src="${product.image}" alt="contact-img" title="contact-img" class="rounded me-3" height="48" />
          <p class='m-0 d-inline-block align-middle font-16'><a href="javascript:void(0)" class='product text-body' id="${product.id}"> ${product.name} </a><br />`
    for (let i = 0; i < 5; i++) {
      if (i < product.rating!) {
        productCell += `<span class='text-warning mdi mdi-star'></span>`
      }
      else {
        productCell += `<span class='text-warning mdi mdi-star-outline'></span>`
      }
    }
    productCell = productCell + `</p>`


    return this.sanitizer.bypassSecurityTrustHtml(productCell);
  }

  // table status cell formatter
  productStatusFormatter(product: Product): SafeHtml {

    if (product.status == true) {
      return this.sanitizer.bypassSecurityTrustHtml(
        ` <span class="badge bg-success">Active</span>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        ` <span class="badge bg-danger">Deactive</span>`
      );
    }



  }


  // table action cell formatter
  productActionFormatter(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-eye"></i></a>
           <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
           <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-delete"></i></a>`
    )
  }


  // compares two cell value
  compare(v1: string | number | boolean, v2: string | number | boolean): number {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name,sort direction
   */
  sort(event: SortEvent): void {
    if (event.direction === '') {
      this.productData = products;
    } else {
      this.productData = [...this.productData].sort((a, b) => {
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
  matches(tableRow: Product, term: string) {
    return tableRow.name?.toLowerCase().includes(term)
      || tableRow.category?.toLowerCase().includes(term)
      || tableRow.added_date?.toLowerCase().includes(term)
      || String(tableRow.price).includes(term)
      || String(tableRow.quantity).includes(term);
  }

  /**
   * Search Method
  */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = products;
      //  filter
      updatedData = updatedData.filter(product => this.matches(product, searchTerm));
      this.productData = updatedData;
    }

  }



}
