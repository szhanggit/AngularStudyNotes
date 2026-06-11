import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Shop } from '../../../models/shop.model';
import { ShopService } from '../../../services/shop.service';
import * as XLSX from 'xlsx';
import { SecurityKeyService } from '../../../services/security-key.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { DictionaryPipe } from 'src/app/merchant/pipes/dictionary.pipe';
import { DictionaryService } from 'src/app/merchant/services/dictionary.service';
import { Dictionary } from 'src/app/merchant/models/dictionary.model';

@Component({
  selector: 'app-shop-batch-upload',
  templateUrl: './shop-batch-upload.component.html',
  styleUrls: ['./shop-batch-upload.component.scss'],
})
export class ShopBatchUploadComponent implements OnInit, OnDestroy {
  @ViewChild('uploader', { static: false }) uploader!: ElementRef;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  merchantId: number;
  tenant: string;
  shops: Shop[] = [];
  errorList: { index: number; reason: string }[] = [];
  sameExternalCode = false;
  show10 = true;

  shop$: Observable<Shop[]>;
  shopExternalCodes: any[] = [];
  draftShopExternalCodes: any[] = [];
  cityStateCountry!: {
    cities: Dictionary[];
    statesOrProvinces: Dictionary[];
    countries: Dictionary[];
  };
  mappedAddressReference!: { Country: string; State: string; City: string }[];

  selectedAccepatanceLoop: number[] = [];

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  destroyed$: Subject<boolean> = new Subject<boolean>();
  phoneNumberRegex =
    /^\s*(?:\+?(\(\d{1,3}\)|\d{1,4}))?[-. ()]*(\d{2,5})[-. ]*(\d{3,5})(?:\s*x (\d+))?\s*$/;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _shopService: ShopService,
    private readonly _router: Router,
    private readonly _securityKeyService: SecurityKeyService,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService,
    private readonly _dictionaryService: DictionaryService,
    private readonly _dictionaryPipe: DictionaryPipe
  ) {
    const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
    this.tenant = this._tenantConfigService.getTenant().name;
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;

    if (this._router.getCurrentNavigation()?.extras) {
      const routerExtrasState = {
        ...this._router.getCurrentNavigation()?.extras.state,
      };
      const rawData = routerExtrasState?.data;
      this.cityStateCountry = routerExtrasState?.cityStateCountry;
      this.mappedAddressReference =
        this._dictionaryService.mappedAddressReference;
      const result = Object.keys(rawData).map((key: any) => [rawData[key]]);

      this._parseData(result);
    }
    this.getCityStateCountry();

    this.shop$ = _shopService.shops$;
    this.shop$.subscribe((shops) => {
      this.shopExternalCodes = shops.map((shop: Shop) =>
        shop.externalCode?.toLowerCase().trim()
      );
      this._authorizationLibraryService.isLoading.next(false);
      this.isLoading$.next(false);
      this._checkForError();
    });
  }

  ngOnInit(): void {
    if (this.merchantId) {
      this._shopService.merchantId = this.merchantId;
      this._authorizationLibraryService.isLoading.next(true);
      this.isLoading$.next(true);
      this._shopService.refresh();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
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
    this.isLoading$.next(true);
    const body: { shop: any[] } = { shop: [] };
    let batchShop = [...this.shops];
    for (let shop of batchShop) {
      shop = { ...shop };
      shop.merchantId = this.merchantId;
      shop.contactName = '';
      shop.securityKey = this._generateSecurityKey();
      shop.lastModifier = 'TXC';

      if (this.sameExternalCode) {
        shop.identityCode = shop.externalCode;
      }

      const address = { ...shop.address };
      delete shop.shopAddress;
      body.shop.push({
        shop: shop,
        address: address,
        acceptanceLoopId: this.selectedAccepatanceLoop,
      });
    }

    this._shopService.createShop(body).subscribe(
      (res) => {
        this.navigateToMerchantDetails(res.success);
        this.isLoading$.next(false);
      },
      (err) => {
        this.toast.showDanger(err.error.message ?? 'Something went wrong');
        this.isLoading$.next(false);
      }
    );
  }

  navigateToMerchantDetails(uploaded: boolean) {
    if (uploaded) {
      this._router.navigate(['merchants/details'], {
        queryParams: {
          tenantName: this.tenant,
          merchantId: this.merchantId,
        },
        state: {
          action: 'batchShopUpload',
        },
      });
    } else {
      this._router.navigate(['merchants/details'], {
        queryParams: {
          tenantName: this.tenant,
          merchantId: this.merchantId,
        },
        state: {
          action: 'shopCancelled',
        },
      });
    }
  }

  toggleExternalCodeCheckbox() {
    this._checkForError();
  }

  removeFromShops(index: number) {
    this.shops.splice(index, 1);
    this.draftShopExternalCodes.splice(index, 1);
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
      const data = XLSX.utils.sheet_to_json(ws).map((row: any) =>
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

  getCityStateCountry() {
    if (!this.cityStateCountry) {
      this._dictionaryService
        .getCityStateCountry()
        .pipe(takeUntil(this.destroyed$))
        .subscribe(([cities, states, countries]) => {
          this.cityStateCountry = {
            cities: JSON.parse(cities.data).dictionaries,
            statesOrProvinces: JSON.parse(states.data).dictionaries,
            countries: JSON.parse(countries.data).dictionaries,
          };

          this.mappedAddressReference =
            this._dictionaryService.getMappedAddressReference(
              this.cityStateCountry.cities,
              this.cityStateCountry.statesOrProvinces,
              this.cityStateCountry.countries
            );
        });
    }
  }

  _checkForError() {
    this.errorList = [];
    for (const [index, shop] of this.shops.entries()) {
      if (!shop.name) {
        this.errorList.push({
          index: index + 1,
          reason: 'No shop name',
        });
      }

      if (this.tenant === 'SG') {
        if (!shop.subsidiaryUen) {
          this.errorList.push({
            index: index + 1,
            reason: 'Subsidiary UEN should be mandatory',
          });
        } else {
          if (shop.subsidiaryUen.length > 30) {
            this.errorList.push({
              index: index + 1,
              reason: 'Subsidiary UEN max length is 30',
            });
          }
        }

        if (!shop.subsidiaryName) {
          this.errorList.push({
            index: index + 1,
            reason: 'Subsidiary name should be mandatory',
          });
        } else {
          if (shop.subsidiaryName.length > 100) {
            this.errorList.push({
              index: index + 1,
              reason: 'Subsidiary Name max length is 100',
            });
          }
        }
      }

      if (!shop.externalCode) {
        this.errorList.push({
          index: index + 1,
          reason: 'No external code',
        });
      } else {
        if (this.maxLengthValidation(shop.externalCode)) {
          this.errorList.push({
            index: index + 1,
            reason: 'External code max length is 50',
          });
        }
      }

      if (
        this.shopExternalCodes.indexOf(
          shop.externalCode?.toLowerCase().trim()
        ) > -1
      ) {
        this.errorList.push({
          index: index + 1,
          reason: `${shop.externalCode} already exists`,
        });
      }
      if (
        this.draftShopExternalCodes!.filter(
          (v, i) => this.draftShopExternalCodes.indexOf(v) !== i
        ).indexOf(shop.externalCode) > -1
      ) {
        this.errorList.push({
          index: index + 1,
          reason: `Duplicate external code (${shop.externalCode}) in file uploaded`,
        });
      }

      if (shop.contactPhone) {
        if (this.maxLengthValidation(shop.contactPhone)) {
          this.errorList.push({
            index: index + 1,
            reason: 'Phone number max length is 50',
          });
        }
      }

      if (!this.isAddressMappingValid(shop)) {
        this.errorList.push({
          index: index + 1,
          reason: "Country, state and city mapping doesn't exist.",
        });
      }
    }
  }

  maxLengthValidation(value: string) {
    return value.length > 50;
  }

  isAddressMappingValid(shop: Shop) {
    if (
      !shop.address?.countryId &&
      !shop.address?.stateOrProvinceId &&
      !shop.address?.cityId
    ) {
      return true;
    }
    if (this.mappedAddressReference) {
      const city = this._dictionaryPipe.transform(
        shop!.address!.cityId!,
        this.cityStateCountry.cities
      );
      const state = this._dictionaryPipe.transform(
        shop!.address!.stateOrProvinceId!,
        this.cityStateCountry.statesOrProvinces
      );
      const country = this._dictionaryPipe.transform(
        shop!.address!.countryId!,
        this.cityStateCountry.countries
      );

      return this.mappedAddressReference.some(
        (address) =>
          (address.City === city &&
            address.State === state &&
            address.Country === country) ||
          (address.Country === country && state === '--' && city === '--') ||
          (address.Country === country &&
            address.State === state &&
            city === '--')
      );
    }
    return false;
  }

  _parseData(result: any) {
    this.shops = [];
    this.draftShopExternalCodes = [];
    for (const toBeMappedObject of result) {
      this.shops.push({
        name: toBeMappedObject[0]['Shop Name'] || toBeMappedObject[0].shopName,
        subsidiaryUen: toBeMappedObject[0]['Subsidiary UEN'],
        subsidiaryName: toBeMappedObject[0]['Subsidiary Name'],
        externalCode:
          toBeMappedObject[0]['Shop External Code']?.toString() ||
          toBeMappedObject[0].externalCode,
        address: {
          detailAddressLine: toBeMappedObject[0]['Detailed Address'],
          postcode: toBeMappedObject[0]['Post Code'],
          district: toBeMappedObject[0]['District'],
          cityId: toBeMappedObject[0]['City'],
          countryId: toBeMappedObject[0]['Country'],
          stateOrProvinceId: toBeMappedObject[0]['State'],
        },
        contactPhone:
          toBeMappedObject[0]['Shop Phone Number']?.toString() ||
          toBeMappedObject[0].contactPhone,
        status: 1,
      });

      this.draftShopExternalCodes.push(
        toBeMappedObject[0]['Shop External Code']?.toString() ||
          toBeMappedObject[0].externalCode
      );
    }
    this.shops = this.dataWithMappedAddressToId(this.shops);

    this._checkForError();
  }

  dataWithMappedAddressToId(data: any) {
    return data.map((d: any) => ({
      ...d,
      address: {
        ...d.address,
        cityId: this._dictionaryPipe.transformStringToId(
          d.address.cityId,
          this.cityStateCountry.cities
        ),
        stateOrProvinceId: this._dictionaryPipe.transformStringToId(
          d.address.stateOrProvinceId,
          this.cityStateCountry.statesOrProvinces
        ),
        countryId: this._dictionaryPipe.transformStringToId(
          d.address.countryId,
          this.cityStateCountry.countries
        ),
      },
    }));
  }

  _generateSecurityKey(): string {
    return this._securityKeyService.generateSecurityKey(31);
  }

  onALSelectChanged(event: any): void {
    this.selectedAccepatanceLoop = event;
  }
}
