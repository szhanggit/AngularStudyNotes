import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCollapse, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, BehaviorSubject, takeUntil, ReplaySubject } from 'rxjs';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { Merchant } from '../../../models/merchant.model';
import { Shop } from '../../../models/shop.model';
import { ShopService } from '../../../services/shop.service';
// import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';
import { PRODUCT_CONSTANTS } from 'src/app/merchant/constants/product-constants';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { environment } from 'src/environments/environment';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { DictionaryService } from 'src/app/merchant/services/dictionary.service';
import { Dictionary } from 'src/app/merchant/models/dictionary.model';
import { GetShopResponse } from 'src/app/merchant/models/get-merchant-shop-response.model';

const HEADING = [[
  'Merchant Internal Code',
  'Shop Name',
  'Shop Internal Code',
  'Shop External Code',
  'Shop Phone Number',
  'Shop Address',
  'Status',
]];

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss'],
})
export class ShopListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() merchant!: Merchant | undefined;
  @Input() tenant!: string;
  @Input() action!: string;
  @Input() countries: Dictionary[] = [];
  @Input() cities: Dictionary[] = [];
  @Input() statesOrProvinces: Dictionary[] = [];
  @ViewChild(NgbCollapse) shopListCollapse!: NgbCollapse;
  @ViewChild(NgbPagination) pagination!: NgbPagination;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  shopListCollapsed = true;
  loading$ = new BehaviorSubject<boolean>(true);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  // list of shops
  shop$: Observable<Shop[]>;
  shopsExport: Shop[] = [];
  total$: Observable<number>;
  total: number = 0;

  merchantAcquirers = PRODUCT_CONSTANTS.MERCHANT_ACQUIRER;
  destroy$: Subject<boolean> = new Subject<boolean>();

  addressProperties: any = {};

  operations: number[] = [];
  // getter for merchant viewer flag
  get isMerchantViewer(): boolean {
    return this._authLibraryService.getElementOperationFlag([environment.merchant_view_op_id, environment.merchant_create_op_id]);
  }

  // getter for merchant editor flag
  get isMerchantEditor(): boolean {
    return this._authLibraryService.getElementOperationFlag([environment.merchant_create_op_id]);
  }

  get itemStart() {
    return this.shopService.page === 1 ? 1 : this.total < 1 ? this.total : (((this.shopService.page - 1) * this.shopService.pageSize) + 1);
  }

  get itemEnd() {
    return this.shopService.page === this.pageCount || this.total < this.shopService.page * this.shopService.pageSize ? this.total : this.shopService.page * this.shopService.pageSize;
  }

  get pageCount() {
    return Math.ceil(this.total / this.shopService.pageSize);
  }

  constructor(public shopService: ShopService,
    private readonly _router: Router,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authLibraryService: AuthorizationLibraryService,
    private _dictionaryService: DictionaryService
  ) {
    this.shop$ = shopService.shops$;
    this.total$ = shopService.total$;
    this.tenant = this._tenantConfigService.getTenant(this.tenant).name;

    this.total$.pipe(takeUntil(this.destroyed$)).subscribe(total => this.total = total);
    this.shop$.pipe(takeUntil(this.destroyed$)).subscribe(shops => {
      this.shopsExport = shops

      // expand if you are from the form and clicked cancelled & there are items to show
      if (shops.length && this.action === 'shopCancelled') {
        this.shopListCollapsed = false;
      }
    });

    // set operations values from userAuthClaim
    this.operations = this._authLibraryService.userAuthClaim.getValue().operations;
  }
  ngOnChanges(): void {
    if (this.cities && this.countries && this.statesOrProvinces)
      this._dictionaryService.mappedAddressReference =
        this._dictionaryService.getMappedAddressReference(
          this.cities,
          this.statesOrProvinces,
          this.countries
        );
  }

  ngOnInit(): void {
    if (this.merchant) {
      this.shopService.merchantId = this.merchant.merchantId;
      this.shopService.refresh();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  updateStatus(shop: Shop): void {
    let mappedShop: Shop = {
      id: shop.shopId,
      name: shop.shopName,
      internalCode: shop.identityCode,
      externalCode: shop.externalCode,
      contactPhone: shop.contactPhone,
      status: shop.shopStatus,
      securityKey: shop.securityKey
    };

    if (mappedShop.status === 0) {
      mappedShop.status = 1;
    } else {
      mappedShop.status = 0;
    }

    const body = { shop: mappedShop, address: shop.address };
    body.shop.lastModifier = 'TXC';

    this.shopService.updateShop(body).pipe(takeUntil(this.destroyed$)).subscribe(res => {
      if (res.success) {
        this.toast?.showSuccess(`Status for ${mappedShop.name} was successfully updated to ${mappedShop.status ? 'active' : 'inactive'}.`);
        this.shopService.refresh();
      } else {
        this.toast?.showDanger(`There was a problem updating status of product ${mappedShop.name}.`);
      }
    });
  }

  navigateToCreateShop() {
    if (this.merchant) {
      this._router.navigate(['merchants/shop/create'],
        {
          queryParams: {
            merchantId: this.merchant.merchantId
          }
        });
    }
  }

  navigateToCreateBatch(data: any) {
    if (this.merchant) {
      this._router.navigate(['merchants/shop/create/batch'], {
        queryParams: {
          tenantName: this.tenant,
          merchantId: this.merchant.merchantId,
        },
        state: {
          data: data,
          cityStateCountry: {
            cities: this.cities,
            statesOrProvinces: this.statesOrProvinces,
            countries: this.countries,
          },
        },
      });
    }
  }

  navigateToEditShop(id?: number) {
    if (this.merchant) {
      this._router.navigate([`merchants/shop/edit/${id}`],
        {
          queryParams: {
            merchantId: this.merchant.merchantId
          }
        });
    }
  }

  collapse() {
    this.shopListCollapse.toggle();
  }

  downloadTemplate() {
    let reference!: XLSX.WorkSheet;
    let shop!: XLSX.WorkSheet;
    let shopSheetContent: any[] = [
      {
        'Shop Name': '',
        'Shop External Code': '',
        'Shop Phone Number': '',
        'Country': '',
        'State': '',
        'City': '',
        'District': '',
        'Detailed Address': '',
        'Post Code': '',
      },
    ];

    if (this.tenant === 'SG') {
      shopSheetContent = [
        {
          'Subsidiary UEN': '',
          'Subsidiary Name': '',
          'Shop Name': '',
          'Shop External Code': '',
          'Shop Phone Number': '',
          'Country': '',
          'State': '',
          'City': '',
          'District': '',
          'Detailed Address': '',
          'Post Code': '',
        },
      ];
    }

    const mappedAddressReference = this._dictionaryService.mappedAddressReference;

    reference = XLSX.utils.json_to_sheet(mappedAddressReference);
    shop = XLSX.utils.json_to_sheet(shopSheetContent);

    shop['!cols'] = this.getAdjustedHeaderColumnWidth(shopSheetContent[0], 10);
    reference['!cols'] = this.getAdjustedHeaderColumnWidth(
      mappedAddressReference[0],
      20
    );
    shop = this.setHeaderStyle(shop);
    reference = this.setHeaderStyle(reference);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, shop, 'Shop');
    XLSX.utils.book_append_sheet(workbook, reference, 'Reference');
    XLSX.writeFile(workbook, 'Shop Import Template.xlsx');
  }

  setHeaderStyle(sheet: any) {
    const headerStyle = {
      fill: {
        patternType: 'solid',
        bgColor: { rgb: "666699" },
        fgColor: { rgb: "666699" },
      },
      font: {
        name: 'Bookman Old Style',
        color: { rgb: 'FFFFFF' }
      }
    }
    const headerRange = XLSX.utils.decode_range(sheet['!ref']!);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const headerCell = XLSX.utils.encode_cell({ r: headerRange.s.r, c: col })
      sheet[headerCell].s = headerStyle
    }

    return sheet;
  }

  getAdjustedHeaderColumnWidth(valueToIterate: any, lengthToIncrease: number) {
    const cols = [];
    for (const [key, value] of Object.entries(valueToIterate)) {
      cols.push({ wch: key?.length + lengthToIncrease });
    }
    return cols;
  }

  exportShops() {
    this._authLibraryService.isLoading.next(true);
    this.shopService.exportAllMerchantShops()
      .subscribe({
        next: (res: GetShopResponse) => {
          this.shopsExport = res.data.shopDetailsModel;
          const mappedShopsExport: Shop[] = [];
          for (let shop of this.shopsExport) {
            mappedShopsExport.push({
              merchantIdentityCode: this.merchant?.identityCode,
              shopName: shop.shopName,
              identityCode: shop.identityCode,
              externalCode: shop.externalCode,
              contactPhone: shop.contactPhone,
              shopAddress: shop.address?.detailAddressLine,
              statusString: shop.shopStatus ? 'Active' : 'Inactive',
            })
          }
  
          if (this.merchant) {
            this.exportAsExcelFile(mappedShopsExport, `${this.merchant.merchantName}_shop`);
          }
        },
        error: () => {
          this.toast.showDanger('Error in exporting shops. Please try again later.');
        },
        complete: () => {
          this._authLibraryService.isLoading.next(false);
        }
      });
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
    return `${excelFileName}_export_${this.formatDate(new Date())}.xls`;
  }

  formatDate(date: Date) {
    const format = 'yyyymmdd';
    const map: any = {
      mm: date.getMonth() + 1,
      dd: date.getDate(),
      yyyy: date.getFullYear()
    }
    return format.replace(/mm|dd|yyyy/gi, matched => map[matched])
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
