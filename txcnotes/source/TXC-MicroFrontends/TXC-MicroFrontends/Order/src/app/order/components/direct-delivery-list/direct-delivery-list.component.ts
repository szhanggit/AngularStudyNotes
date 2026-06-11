import { Component, Input, OnInit } from '@angular/core';
import { TableHeader, TableModel, TableRow } from 'src/app/shared/models/dumb-models/table.model';
import { Product } from 'src/app/shared/models/product.model';
import { ORDER_CONSTANTS } from '../../constants/order-constants';
import { DeliveryService } from '../../services/delivery.service';

@Component({
  selector: 'app-direct-delivery-list',
  templateUrl: './direct-delivery-list.component.html',
  styleUrls: ['./direct-delivery-list.component.scss']
})
export class DirectDeliveryListComponent implements OnInit {
  @Input() product!: Product;

  pageSizes = ORDER_CONSTANTS.PAGE_SIZES;
  pageSize:number = 20;
  searchTerm: string = '';

  //mock pagination
  page: number = 1;

  tableHeaders: TableHeader[] = [
    {
      headerId: 'email',
      headerName: 'Email',
    },
    {
      headerId: 'sms',
      headerName: 'SMS',
    },
    {
      headerId: 'activeDate',
      headerName: 'Active Date',
    },
    {
      headerId: 'expiryDateType',
      headerName: 'Expiry Date Type',
    },
    {
      headerId: 'expiryDate',
      headerName: 'Expiry Date',
    }
  ];
  tableRows: TableRow[] = [];

  get directDeliveryDetailsTableModel(): TableModel {
    return {
      tableHeaders: this.tableHeaders,
      tableRows: this.tableRows,
    };
  }
  constructor(
    public deliveryService: DeliveryService
  ){}

  ngOnInit(){
    this.deliveryService.deliveryDetailsList$.subscribe(items => {
        this.tableRows = items.map(item => ({
          data: [
            { value: item.email },
            { value: item.sms },
            { value: item.activeDate },
            { value: item.expiryDateType },
            { value: item.expiryDate },
          ],
        }));
      });
  }
}
