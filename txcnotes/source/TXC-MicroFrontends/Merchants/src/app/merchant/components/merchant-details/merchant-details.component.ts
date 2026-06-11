import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { BatchUploadShopToast, ContractCreatedToast, IMerchantDetailsToastDefinition, MerchantUpdateCancelled, MerchantUpdatedToast, RuleCancelled, RuleCreatedToast, RuleUpdatedToast, ShopCancelled, ShopCreatedToast, ShopUpdatedToast } from '../../models/merchant-details-toast.model';
import { Merchant } from '../../models/merchant.model';
import { IProgram } from '../../models/program.model';
import { MerchantService } from '../../services/merchant.service';
import { ProgramService } from '../../services/program.service';
import { TenantConfigService } from '../../services/tenant-config.service';
import { ShopListComponent } from '../shops/shop-list/shop-list.component';
import { VoucherNumberRuleListComponent } from '../voucher-number-rule/voucher-number-rule-list/voucher-number-rule-list.component';

import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, forkJoin, ReplaySubject, takeUntil } from 'rxjs';
import { PRODUCT_CONSTANTS } from '../../constants/product-constants';
import { DictionaryService } from '../../services/dictionary.service';
import { Dictionary } from '../../models/dictionary.model';

@Component({
  selector: 'app-merchant-details',
  templateUrl: './merchant-details.component.html',
  styleUrls: ['./merchant-details.component.scss']
})
export class MerchantDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild(ShopListComponent) shopList!: ShopListComponent;
  @ViewChild(VoucherNumberRuleListComponent) vnrList!: VoucherNumberRuleListComponent;

  merchant!: Merchant;
  id: number;
  tenant!: string;
  action!: string;

  programs: IProgram[] = [];
  currentProgram!: IProgram;

  merchantDetailsCollapsed = true;


  isLoadingDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  merchantDetailsToastDefinitions: IMerchantDetailsToastDefinition[] = [];

  loading$ = new BehaviorSubject<boolean>(true);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  merchantAcquirers: Dictionary[] = [];
  categories: Dictionary[]= [];
  countries: Dictionary[]= [];
  cities: Dictionary[]= [];
  statesOrProvinces: Dictionary[]= [];

  operations: number[] = [];
  // getter for merchant viewer flag
  get isMerchantViewer(): boolean {
    return this._authLibService.getElementOperationFlag([environment.merchant_view_op_id, environment.merchant_create_op_id]);
  }

  // getter for merchant editor flag
  get isMerchantEditor(): boolean {
    return this._authLibService.getElementOperationFlag([environment.merchant_create_op_id]);
  }

  constructor(private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _merchantService: MerchantService,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _programService: ProgramService,
    private readonly _authLibService: AuthorizationLibraryService,
    private readonly _dictionaryService: DictionaryService) {
    const tenantFromRoute = this._route.snapshot.queryParamMap.get('tenantName');
    const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
    this.tenant = this._tenantConfigService.getTenant().name;
    this.id = idFromRoute ? Number.parseInt(idFromRoute) : 0;
    this.action = history.state?.action;

  }

  ngOnInit(): void {
    this._authLibService.isLoading.next(true);
    this._merchantService.getMerchantById(this.id).subscribe(
      (res) => {
        this.merchant = res.data.merchantDetails[0];
        // get program by id using graphql endpoint
        this._programService.getProgramId(this.merchant.programId).subscribe(
          res => {
            this.currentProgram = JSON.parse(res.data).programs.items[0];
            if (!this.currentProgram) {
              this.isLoadingDetails.next(false);
              this._authLibService.isLoading.next(false);
              this.backToList('errorLoadingProgram');
            }

            // to expand panel if record is added/updated
            setTimeout(() => {
              const shopName = history.state?.shopName;
              const vnrName = history.state?.vnrName;
              const contractName = history.state?.contractName;

              if (this.merchant) {
                this.merchantDetailsToastDefinitions = [
                  new MerchantUpdatedToast(this.toast, this.shopList, this.vnrList, this.merchant.merchantName, vnrName, shopName, contractName),
                  new MerchantUpdateCancelled(this.toast, this.shopList, this.vnrList, this.merchant.merchantName, vnrName, shopName, contractName),
                  new BatchUploadShopToast(this.toast, this.shopList, this.vnrList, this.merchant.merchantName, vnrName, shopName, contractName),
                  new ShopCreatedToast(this.toast, this.shopList, this.vnrList, this.merchant.merchantName, vnrName, shopName, contractName),
                  new ShopUpdatedToast(this.toast, this.shopList, this.vnrList, this.merchant.merchantName, vnrName, shopName, contractName),
                  new ShopCancelled(this.toast, this.shopList, this.vnrList, this.merchant.merchantName, vnrName, shopName, contractName),
                  new RuleCreatedToast(this.toast, this.shopList, this.vnrList, this.merchant.merchantName, vnrName, shopName, contractName),
                  new RuleUpdatedToast(this.toast, this.shopList, this.vnrList, this.merchant.merchantName, vnrName, shopName, contractName),
                  new RuleCancelled(this.toast, this.shopList, this.vnrList, this.merchant.merchantName, vnrName, shopName, contractName),
                  new ContractCreatedToast(this.toast, this.shopList, this.vnrList, this.merchant.merchantName, vnrName, shopName, contractName),
                ];

                if (this.action) {
                  let def = this.merchantDetailsToastDefinitions.find(f => f.action === this.action);
                  if (def && !def.cancelled) {
                    def.getMessageToast();
                    this.merchantDetailsCollapsed = def.merchantDetailsCollapsed;
                  }
                }
              }
            });
          },
          () => {
            this.isLoadingDetails.next(false);
            this._authLibService.isLoading.next(false);
            this.backToList('errorLoadingProgram');
          },
          () => {
            this.isLoadingDetails.next(false);
            this._authLibService.isLoading.next(false);
          });
      },
      () => {
        this.isLoadingDetails.next(false);
        this._authLibService.isLoading.next(false);
        this.backToList('errorLoadingMerchantDetails');
      });

    forkJoin(
      this._dictionaryService.getDictionaryItemsByCategory('MerchantCategory'),
      this._dictionaryService.getDictionaryItemsByCategory('Country'),
      this._dictionaryService.getDictionaryItemsByCategory('City'),
      this._dictionaryService.getDictionaryItemsByCategory('StateOrProvince'),
      this._dictionaryService.getDictionaryItemsByCategory('VoucherIssuer').
        pipe(
          takeUntil(this.destroyed$))
    ).subscribe(([categories, countries, cities, statesOrProvinces, merchantAcquirers]) => {
      this.categories = JSON.parse(categories.data).dictionaries;
      this.countries = JSON.parse(countries.data).dictionaries;
      this.cities = JSON.parse(cities.data).dictionaries;
      this.statesOrProvinces = JSON.parse(statesOrProvinces.data).dictionaries;
      this.merchantAcquirers = JSON.parse(merchantAcquirers.data).dictionaries;
    },
      () => {
        this.toast.showDanger('Error loading dropdown values. Please try again later.');
      }, () => {
        this.loading$.next(false);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  navigateToUpdateMerchant() {
    if (this.merchant) {
      this._router.navigate(['merchants/edit'],
        {
          queryParams: {
            tenantName: this.tenant,
            merchantId: this.merchant.merchantId
          },
          state: {
            merchant: this.merchant
          }
        });
    }
  }

  backToList(action?: string): void {
    if (action) {
      this._router.navigate(['/merchants'],
        {
          state: {
            action: action,
            merchantName: this.merchant.name
          }
        });
    } else {
      this._router.navigate(['/merchants']);
    }
  }
}
