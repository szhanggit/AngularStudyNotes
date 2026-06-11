import { BidiModule } from '@angular/cdk/bidi';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { PRODUCT_CONSTANTS } from 'src/app/pages/products/constants/product-constants';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { Merchant } from '../../models/merchant.model';
import { MerchantService } from '../../services/merchant.service';

@Component({
  selector: 'app-merchant-list',
  templateUrl: './merchant-list.component.html',
  styleUrls: ['./merchant-list.component.scss']
})
export class MerchantListComponent implements OnInit, OnDestroy {
  @ViewChild(NgbPagination) pagination!: NgbPagination;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  // list of merchants 
  merchants$: Observable<Merchant[]>;
  total$: Observable<number>;
  total: number = 0;

  tenant!: string;
  merchantAcquirers = PRODUCT_CONSTANTS.MERCHANT_ACQUIRER;
  destroy$: Subject<boolean> = new Subject<boolean>();


  get itemStart() {
    return this.merchantService.page === 1 ? 1 : this.total < 1 ? this.total : (((this.merchantService.page - 1) * this.merchantService.pageSize) + 1);
  }

  get itemEnd() {
    return this.merchantService.page === this.pageCount || this.total < this.merchantService.page * this.merchantService.pageSize ? this.total : this.merchantService.page * this.merchantService.pageSize;
  }

  get pageCount() {
    return this.pagination?.pageCount;
  }

  constructor(public merchantService: MerchantService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router) {
    this.merchants$ = merchantService.merchants$;
    this.total$ = merchantService.total$;
    this.total$.subscribe(total => this.total = total);

    const tenantFromRoute = this._route.snapshot.queryParamMap.get('tenantName');
    this.tenant = tenantFromRoute ? tenantFromRoute : 'TW';

    _route.params.subscribe(() => {
      this.merchantService.refresh();

      if (this._router.getCurrentNavigation()?.extras?.state?.action) {
        const action = this._router.getCurrentNavigation().extras.state.action;
        const name = this._router.getCurrentNavigation().extras.state.merchantName;
        if (action && name) {
          setTimeout(() => {
            this.toast?.showSuccess(`Successfully ${action} merchant ${name}`);
          }, 500)
        }
      }
    });

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  setMerchantStatus(merchant: any) {
    if (merchant.status === 0) {
      merchant.status = 1;
    } else {
      merchant.status = 0;
    }
    const body = { merchant: {...merchant}, address: { ...merchant.address } };
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

  navigateToCreateMerchant() {
    this._router.navigate([`merchant-list/create`]);
  }

  navigateToMerchantDetails(merchant: Merchant) {
    this._router.navigate(['merchant-list/details'],
      {
        queryParams: {
          tenantName: 'TW',
          merchantId: merchant.merchantId
        },
        state: {
          merchant
        }
      });
  }
}
