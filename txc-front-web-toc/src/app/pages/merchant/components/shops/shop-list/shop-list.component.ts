import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCollapse, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { PRODUCT_CONSTANTS } from 'src/app/pages/products/constants/product-constants';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { Merchant } from '../../../models/merchant.model';
import { Shop } from '../../../models/shop.model';
import { ShopService } from '../../../services/shop.service';
import * as XLSX from 'xlsx';

const HEADING = [[
  'Merchant Identity Code',
  'Name',
  'External Code',
  'Contact Name 1',
  'Contact Name 2',
  'Contact Phone 1',
  'Contact Phone 2',
  'Status',
  'Detail Address'
]];

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {
  @Input() merchant: Merchant;
  @ViewChild(NgbCollapse) shopListCollapse!: NgbCollapse;
  @ViewChild(NgbPagination) pagination!: NgbPagination;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  shopListCollapsed = true;

  // list of merchants 
  shop$: Observable<Shop[]>;
  shopsExport: Shop[] = [];
  total$: Observable<number>;
  total: number = 0;

  tenant!: string;
  merchantAcquirers = PRODUCT_CONSTANTS.MERCHANT_ACQUIRER;
  destroy$: Subject<boolean> = new Subject<boolean>();


  get itemStart() {
    return this.shopService.page === 1 ? 1 : this.total < 1 ? this.total : (((this.shopService.page - 1) * this.shopService.pageSize) + 1);
  }

  get itemEnd() {
    return this.shopService.page === this.pageCount || this.total < this.shopService.page * this.shopService.pageSize ? this.total : this.shopService.page * this.shopService.pageSize;
  }

  get pageCount() {
    return this.pagination?.pageCount;
  }

  constructor(public shopService: ShopService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router) {
    this.shop$ = shopService.shops$;
    this.total$ = shopService.total$;

    this.total$.subscribe(total => this.total = total);
    this.shop$.subscribe(shops => this.shopsExport = shops);

    const tenantFromRoute = this._route.snapshot.queryParamMap.get('tenantName');

    this.tenant = tenantFromRoute ? tenantFromRoute : 'TW';
  }

  ngOnInit(): void {
  }

  updateStatus(shop: Shop): void {
    let mappedShop: Shop = {
      id: shop.shopId,
      name: shop.shopName,
      internalCode: shop.identityCode,
      externalCode: shop.externalCode,
      shopAddress: shop.address.detailAddressLine,
      contactPhone: shop.contactPhone,
      status: shop.shopStatus,
      securityKey: shop.securityKey
    };

    if (mappedShop.status === 0) {
      mappedShop.status = 1;
    } else {
      mappedShop.status = 0;
    }

    const body = { shop: mappedShop, address: { detailAddressLine: mappedShop.shopAddress } };
    body.shop.lastModifier = 'TXC';

    this.shopService.updateShop(body).subscribe(res => {
      if (res.success) {
        this.toast?.showSuccess(`Status for ${mappedShop.name} was successfully updated to ${mappedShop.status ? 'active' : 'inactive'}.`);
      } else {
        this.toast?.showDanger(`There was a problem updating status of product ${mappedShop.name}.`);
      }
    });
  }

  navigateToCreateShop() {
    this._router.navigate(['merchant-list/shop/create'],
      {
        queryParams: {
          merchantId: this.merchant.merchantId
        }
      });
  }

  navigateToCreateBatch(data: any) {
    this._router.navigate([`merchant-list/shop/create/batch`]);

    this._router.navigate(['merchant-list/shop/create/batch'],
      {
        queryParams: {
          tenantName: 'TW',
          merchantId: this.merchant.merchantId
        },
        state: {
          data: data
        }
      });
  }

  navigateToEditShop(id: number) {
    this._router.navigate([`merchant-list/shop/edit/${id}`],
      {
        queryParams: {
          merchantId: this.merchant.merchantId
        }
      });
  }

  collapse() {
    this.shopListCollapse.toggle()
    if (!this.shopListCollapsed) {
      this.shopService.merchantId = this.merchant.merchantId;
      this.shopService.refresh();
    }
  }

  downloadTemplate(event: Event) {
    event.stopPropagation();
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = '/assets/templates/template.xls';
    link.download = 'Shop Import Template.xls';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  exportShops() {
    const mappedShopsExport: Shop[] = [];
    for (let shop of this.shopsExport) {
      mappedShopsExport.push({
        merchantId: shop.merchantId,
        shopName: shop.shopName,
        externalCode: shop.externalCode,
        contactName: shop.contactName,
        contactName2: shop.contactName2,
        contactPhone: shop.contactPhone,
        contactPhone2: shop.contactPhone2,
        statusString: shop.shopStatus ? 'Active' : 'Inactive',
        shopAddress: shop.address.detailAddressLine
      })
    }

    this.exportAsExcelFile(mappedShopsExport, `${this.merchant.merchantName}_shops`);
  }

  // call this method when you want the upload to begin
  uploadFile(event: Event): void {
    const target: DataTransfer = <DataTransfer>(event.target as any);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils
        .sheet_to_json(ws)
        .map((row: any) =>
          Object.keys(row).reduce((obj: any, key: string) => {
            obj[key.trim()] = row[key];
            return obj;
          }, {})
        );
      this.navigateToCreateBatch(data);
    };
  }

  toExportFileName(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.xls`;
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const header = Object.keys(json[0]); // columns name

    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // columns length added
      wscols.push({ wch: header[i].length + 7 })
    }

    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, HEADING);
    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, json, { origin: 'A2', skipHeader: true });
    ws["!cols"] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, 'Shop');
    XLSX.writeFile(wb, this.toExportFileName(excelFileName));
  }
}
