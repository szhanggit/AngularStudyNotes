import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbNav, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { Merchant } from '../../models/merchant.model';
import { MerchantService } from '../../services/merchant.service';
import { TenantConfigService } from '../../services/tenant-config.service';
import { MerchantGroupService } from '../../services/merchant-group.service';
import { MerchantGroup } from '../../models/get-merchant-group-response.model';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { environment } from 'src/environments/environment';
import { EditMerchantGroupRequest } from '../../models/edit-merchant-group.models';
import { Dictionary } from '../../models/dictionary.model';
import { DictionaryService } from '../../services/dictionary.service';
import { SkuService } from '../../services/sku.service';

@Component({
  selector: 'app-merchant-list',
  templateUrl: './merchant-list.component.html',
  styleUrls: ['./merchant-list.component.scss']
})
export class MerchantListComponent implements OnInit, OnDestroy {
  @ViewChild(NgbPagination) pagination!: NgbPagination;
  @ViewChild(NgbPagination) groupPagination!: NgbPagination;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild(NgbNav) nav!: NgbNav;

  readonly MerchantGoupEnabledTenants: string[] = ["TW", "SG"];

  // list of merchants
  merchants$: Observable<Merchant[]>;
  total$: Observable<number>;
  isLoading$: Observable<boolean>;

  // merchant group
  merchantsGroup$: Observable<MerchantGroup[]>;
  groupTotal$: Observable<number>;
  totalMerchantsGroup$ = new BehaviorSubject<number>(0);
  isGroupLoading$: Observable<boolean>;

  isMerchantTab = true;
  total: number = 0;
  groupTotal: number = 0;

  tenant!: string;
  merchantAcquirers: Dictionary[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  operations: number[] = [];


  get currentPage() {
    const service = this.isMerchantTab ? this.merchantService : this.merchantGroupService;
    return service.page;
  }

  get itemStart() {
    const service = this.isMerchantTab ? this.merchantService : this.merchantGroupService;
    const total = this.isMerchantTab ? this.total : this.groupTotal;
    return service.page === 1 ? 1 : total < 1 ? total : (((service.page - 1) * service.pageSize) + 1);
  }

  get itemEnd() {
    const service = this.isMerchantTab ? this.merchantService : this.merchantGroupService;
    const total = this.isMerchantTab ? this.total : this.groupTotal;
    return service.page === this.pageCount || total < service.page * service.pageSize ? total : service.page * service.pageSize;
  }

  get pageCount() {
    const service = this.isMerchantTab ? this.merchantService : this.merchantGroupService;
    const total = this.isMerchantTab ? this.total : this.groupTotal;
    return Math.ceil(total / service.pageSize);
  }

  // getter for merchant viewer flag
  get isMerchantViewer(): boolean {
    return this._authLibraryService.getElementOperationFlag([environment.merchant_view_op_id, environment.merchant_create_op_id]);
  }

  // getter for merchant editor flag
  get isMerchantEditor(): boolean {
    return this._authLibraryService.getElementOperationFlag([environment.merchant_create_op_id]);
  }

  constructor(
    public merchantService: MerchantService,
    public merchantGroupService: MerchantGroupService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _dictionaryService: DictionaryService,
    private readonly _authLibraryService: AuthorizationLibraryService,
    private skuService: SkuService) {
    this.merchants$ = merchantService.merchants$;
    this.total$ = merchantService.total$;
    this.isLoading$ = merchantService.loading$;

    this.merchantsGroup$ = merchantGroupService.merchantsGroup$;
    this.groupTotal$ = merchantGroupService.groupTotal$;
    this.isGroupLoading$ = merchantGroupService.goupLoading$;

    this.total$.subscribe(total => this.total = total);
    this.groupTotal$.subscribe(groupTotal => this.groupTotal = groupTotal);

    const tenantFromRoute = this._route.snapshot.queryParamMap.get('tenantName');
    this.tenant = this._tenantConfigService.getTenant(tenantFromRoute).name.toUpperCase();

    _route.params.subscribe(() => {
      this.merchantService.reset();
      if (this._router.getCurrentNavigation()?.extras?.state) {
        const action = this._router.getCurrentNavigation()?.extras.state?.action;
        const name = this._router.getCurrentNavigation()?.extras.state?.merchantName;
        if (action) {
          setTimeout(() => {
            if (action === 'errorLoadingProgram') {
              this.toast.showDanger(`Merchant Details - Error loading program details. Please try again later.`);
            } else if (action === 'errorLoadingMerchantDetails') {
              this.toast.showDanger(`Merchant Details - Error loading merchant details. Please try again later.`);
            } else {
              this.toast?.showSuccess(`Successfully ${action} merchant ${name}`);
            }
          }, 500)
        }
      }
    });

    // set operations values from userAuthClaim
    this.operations = this._authLibraryService.userAuthClaim.getValue().operations;
  }

  ngOnInit(): void {
    this.merchantGroupService.reset();

    if (this.tenant ==='GL') {
      this._dictionaryService.getDictionaryItemsByCategory('VoucherIssuer').subscribe(
        res => {
          this.merchantAcquirers = JSON.parse(res.data).dictionaries;
        },
        () => {
          this.toast.showDanger('Error loading merchant acquirer list. Please try again later.');
        }
      )
    }

    this.skuService.updateCompanyTaxRate();
  }

  ngAfterViewInit(): void {
    this.nav.navChange.subscribe(e => {
     this.isMerchantTab = e.nextId === 1;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.merchantService.reset();
  }

  setMerchantStatus(merchant: any) {
    if (merchant.status === 0) {
      merchant.status = 1;
    } else {
      merchant.status = 0;
    }
    const body = { merchant: { ...merchant }, address: { ...merchant.address } };
    body.merchant.id = body.merchant.merchantId;
    body.merchant.name = body.merchant.merchantName;
    body.merchant.modifier = 'modifier';
    delete body.merchant.identityCode;
    delete body.merchant.merchantId;
    delete body.merchant.merchantName;
    delete body.merchant.programCode;
    delete body.merchant.programId;
    delete body.merchant.merchantAddress;
    delete body.merchant.workKey;
    delete body.merchant.workKeyCreatedTime;
    delete body.merchant.workKeyExpireTime;
    delete body.merchant.workKeyId;
    delete body.merchant.address;

    this.merchantService.updateMerchant(body).subscribe(res => {
      if (res.success) {
        this.toast?.showSuccess(`Status for ${merchant.merchantName} was successfully updated to ${merchant.status ? 'active' : 'inactive'}.`);
      } else {
        this.toast?.showDanger(`There was a problem updating status of product ${merchant.merchantName}.`);
      }
    });
  }

  getMerchantAcquirerName(id?: number): string {
    return this.merchantAcquirers.find(merchantAcquirer => merchantAcquirer.dictionaryId === id)?.displayName ?? '--';
  }

  navigateToDetails(event: MouseEvent, merchantOrGroup: Merchant | MerchantGroup, type: string = 'merchant') {
    event.preventDefault();
    if (event.ctrlKey) {
      window.open(this.getEventUrl(merchantOrGroup, type), '_blank');
    } else {
      this._router.navigateByUrl(this.getEventUrl(merchantOrGroup, type));
    }
  }
  
  getEventUrl(merchantOrGroup: Merchant | MerchantGroup, type: string ='merchant'): string {
    const navigateTo = type === "merchant" ? 'details' : 'merchant-group-details'
    return `merchants/${navigateTo}?tenantName=${this.tenant}&merchantId=${merchantOrGroup.merchantId}`;
  }
  navigateToCreateMerchant() {
    this._router.navigate(['merchants/create']);
  }
  navigateToCreateMerchantGroup() {
    this._router.navigate(['/merchants/merchant-group/create']);
  }
  paginationService() {
    return this.isMerchantTab? this.merchantService.page : this.merchantGroupService.page
  }

  // Merchant Group related
  setMerchantGroupStatus(merchantgroup: MerchantGroup) {
    const request: EditMerchantGroupRequest = {
      merchantGroupId: merchantgroup.merchantGroupId || 0,
      status: !(merchantgroup.merchant?.status === 1),
    }
    this.merchantGroupService.updateMerchantGroup(request).subscribe(res => {
      merchantgroup.merchant?.status === 1 ? 0 : 1;
      if (res.success) {
        this.toast?.showSuccess(`Status for ${merchantgroup?.merchant?.name} was successfully updated to ${merchantgroup?.merchant?.status ? 'active' : 'inactive'}.`);
      } else {
        this.toast?.showDanger(`There was a problem updating status of product ${merchantgroup?.merchant?.name}.`);
      }
    },
    err => {
      this.toast.showDanger(err.error.Message ?? err.error.message);
    })
  }

  getStatusTrueCount(merchantgroup: any): number {
    let count = 0;
    if (merchantgroup.merchantGroupMerchantMaps) {
      merchantgroup.merchantGroupMerchantMaps.forEach((map: any) => {
        if (map.status) {
          count++;
        }
      });
    }
    return count;
  }
}
