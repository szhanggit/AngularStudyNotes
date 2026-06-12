import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Shop } from '../../../models/shop.model';
import { ShopService } from '../../../services/shop.service';
import * as XLSX from 'xlsx';
import { SecurityKeyService } from '../../../services/security-key.service';

@Component({
  selector: 'app-shop-batch-upload',
  templateUrl: './shop-batch-upload.component.html',
  styleUrls: ['./shop-batch-upload.component.scss']
})
export class ShopBatchUploadComponent implements OnInit {
  @ViewChild('uploader', { static: false }) uploader: ElementRef;
  
  merchantId: number;
  shops: Shop[] = [];
  errorList: { index: number, reason: string }[] = [];
  sameExternalCode = false;
  show10 = true;

  constructor(private readonly _route: ActivatedRoute,
    private readonly _shopService: ShopService,
    private readonly _router: Router,
    private readonly _securityKeyService: SecurityKeyService) {

    const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;

    if (this._router.getCurrentNavigation()?.extras) {
      const rawData = { ...this._router.getCurrentNavigation()?.extras.state?.data };
      const result = Object.keys(rawData).map((key: any) => [rawData[key]]);

      this._parseData(result);
    }
  }

  ngOnInit(): void {
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  toggleCollapsibleTable() {
    this.show10 = !this.show10;
  }

  batchUpload(): void {
    const body: {shop: any[]} = { shop: [] };
    const batchShop = [ ...this.shops ];
    for (let shop of batchShop) {
      shop.merchantId = this.merchantId;
      shop.contactName = shop.name;
      shop.securityKey = this._generateSecurityKey();
      shop.lastModifier = 'TXC';

      if (this.sameExternalCode) {
        shop.externalCode = shop.identityCode;
      }

      const address = { detailAddressLine: shop.shopAddress };
      delete shop.shopAddress;
      body.shop.push({shop: shop, address: address});
    }

    this._shopService.createShop(body).subscribe(res => {
      this.navigateToMerchantDetails(res.success);
    });
  }

  navigateToMerchantDetails(uploaded: boolean) {
    if (uploaded) {
      this._router.navigate(['merchant-list/details'],
      {
        queryParams: {
          tenantName: 'TW',
          merchantId: this.merchantId
        },
        state: {
          action: 'batchUpload'
        }
      });
    } else {
      this._router.navigate(['merchant-list/details'],
      {
        queryParams: {
          tenantName: 'TW',
          merchantId: this.merchantId
        }
      });
    }
    
  }

  toggleExternalCodeCheckbox() {
    this._checkForError();
  }

  removeFromShops(index: number) {
    this.shops.splice(index, 1);
    this._checkForError();
  }

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
      const result = Object.keys(data).map((key: any) => [data[key]]);

      this._parseData(result);
      this.uploader.nativeElement.value = null;
    };
  }

  _checkForError() {
    this.errorList = [];
    for (const [index, shop] of this.shops.entries()) {
      if (!shop.name) {
        this.errorList.push({
          index: index + 1,
          reason: 'No shop name'
        })
      }

      if (!shop.externalCode && !this.sameExternalCode) {
        this.errorList.push({
          index: index + 1,
          reason: 'No external code'
        })
      }
    }
  }

  _parseData(result: any) {
    this.shops = [];
    for (const toBeMappedObject of result) {
      let status = toBeMappedObject[0]["Status"] || toBeMappedObject[0].shopStatus;
      if (status.toLowerCase().trim() === 'active' || status.toLowerCase().trim() === 'inactive') {
        status = status.toLowerCase().trim() === 'active' ? 1 : 0; 
      }
      this.shops.push({
        name: toBeMappedObject[0]["Name"] || toBeMappedObject[0].shopName,
        identityCode: toBeMappedObject[0]["Merchant Identity Code"]?.toString() || toBeMappedObject[0].identityCode,
        externalCode: toBeMappedObject[0]["External Code"]?.toString() || toBeMappedObject[0].externalCode,
        shopAddress: toBeMappedObject[0]["Detail Address"]?.toString() || toBeMappedObject[0].externalCode,
        contactPhone: toBeMappedObject[0]["Contact Phone 1"]?.toString() || toBeMappedObject[0].address?.detailAddressLine,
        status: status,
      });
    }

    this._checkForError();
  }

  _generateSecurityKey(): string {
    return this._securityKeyService.generateSecurityKey(31);
  }
}
