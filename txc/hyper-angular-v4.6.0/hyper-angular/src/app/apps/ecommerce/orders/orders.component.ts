import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

// type
import { AdvancedTableComponent, Column } from '../../../shared/advanced-table/advanced-table.component';
import { SortEvent } from '../../../shared/advanced-table/sortable.directive';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { Order } from '../shared/models';

// data
import { orders } from '../shared/data';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, AfterViewInit {

  pageTitle: BreadcrumbItem[] = [];
  orderList: Order[] = [];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  selectAll: boolean = false;
  OrderStatusGroup: string = "All";
  loading: boolean = false;
  columns: Column[] = [];


  @ViewChild('advancedTable') advancedTable!: AdvancedTableComponent;

  constructor (private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.pageTitle = [{ label: 'eCommerce', path: '/' }, { label: 'Order', path: '/', active: true }];

    // get order list
    this._fetchData();

    // initialize advance table 
    this.initAdvancedTableData();
  }

  /**
   *  fetches order list
   */
  _fetchData(): void {
    this.orderList = orders;
  }


  ngAfterViewInit(): void {
  }

  // initialize advance table columns
  initAdvancedTableData(): void {
    this.columns = [
      {
        name: 'order_id',
        label: 'Order ID',
        formatter: this.orderIDFormatter.bind(this)
      },
      {
        name: 'order_date',
        label: 'Date',
        formatter: this.orderDateFormatter.bind(this)
      },
      {
        name: 'payment_status',
        label: 'Payment Status',
        formatter: this.ordePaymentStatusFormatter.bind(this)
      },
      {
        name: 'total',
        label: 'Total',
        formatter: (order: Order) => order.total
      }, {
        name: 'payment_method',
        label: 'Payment Method',
        formatter: (order: Order) => order.payment_method
      },
      {
        name: 'order_status',
        label: 'Order Status',
        formatter: this.orderStatusFormatter.bind(this)
      },
      {
        name: 'Action',
        label: 'Action',
        sort: false,
        formatter: this.orderActionFormatter.bind(this)
      }];

  }


  /**
   *  handles operations that need to be performed after loading table
   */
  handleTableLoad(): void {
    // product cell
    document.querySelectorAll('.order').forEach((e) => {
      e.addEventListener("click", () => {
        this.router.navigate(['../order-details'], { relativeTo: this.route, queryParams: { id: e.id } })
      });
    })
  }

  // formats order ID cell
  orderIDFormatter(order: Order): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0)" class="order text-body fw-bold" id="${order.id}">#BM${order.order_id}</a> `
    );
  }

  // formats order date cell
  orderDateFormatter(order: Order): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `${order.order_date} <small class="text-muted">${order.order_time}</small>`
    );
  }

  // formats payment status cell
  ordePaymentStatusFormatter(order: Order): SafeHtml {
    if (order.payment_status == "Paid") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge badge-success-lighten"><i class="mdi mdi-bitcoin"></i> Paid</span></h5>`
      );
    }
    else if (order.payment_status == "Awaiting Authorization") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge badge-warning-lighten"><i class="mdi mdi-timer-sand"></i> Awaiting Authorization</span></h5>`
      );
    }
    else if (order.payment_status == "Payment Failed") {
      return this.sanitizer.bypassSecurityTrustHtml(
        ` <h5><span class="badge badge-danger-lighten"><i class="mdi mdi-cancel"></i> Payment Failed</span></h5>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge badge-info-lighten"><i class="mdi mdi-cash"></i> Unpaid</span></h5>`
      );
    }

  }

  // formats order status
  orderStatusFormatter(order: Order): SafeHtml {
    if (order.order_status == "Processing") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge badge-warning-lighten">Processing</span></h5>`
      );
    }
    else if (order.order_status == "Delivered") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge badge-success-lighten">Delivered</span></h5>`
      );
    }
    else if (order.order_status == "Shipped") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge badge-info-lighten">Shipped</span></h5>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge badge-danger-lighten">Cancelled</span></h5>`
      );
    }

  }

  // action cell formatter
  orderActionFormatter(order: Order): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-eye"></i></a>
           <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
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
      this.orderList = orders;
    } else {
      this.orderList = [...this.orderList].sort((a, b) => {
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
  matches(tableRow: Order, term: string) {
    return tableRow.order_id?.toLowerCase().includes(term)
      || tableRow.order_date?.toLowerCase().includes(term)
      || tableRow.total?.toLowerCase().includes(term)
      || tableRow.payment_method?.toLowerCase().includes(term)
      || tableRow.payment_status?.toLowerCase().includes(term)
      || tableRow.order_status?.toLocaleLowerCase().includes(term);
  }

  /**
   * Search Method
  */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = orders;
      //  filter
      updatedData = updatedData.filter(product => this.matches(product, searchTerm));
      this.orderList = updatedData;
    }

  }



  /**
   * change order status group
   * @param OrderStatusGroup order status
   */
  changeOrderStatusGroup(OrderStatusGroup: string): void {
    this.loading = true;
    let updatedData = orders;
    //  filter
    updatedData = OrderStatusGroup === "All" ? orders : [...orders].filter((o) => o.payment_status?.includes(OrderStatusGroup))
    this.orderList = updatedData;


    setTimeout(() => {
      this.loading = false;
    }, 400);
  }



}
