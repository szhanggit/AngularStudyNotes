import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfirmationModalComponent, NgbdToastGlobal } from '@txc-angular/component-library';
import { Merchant } from '../../../../models/merchant.model';
import { MerchantGroupService } from '../../../../services/merchant-group.service';
import { MerchantService } from '../../../../services/merchant.service';
import { TenantConfigService } from '../../../../services/tenant-config.service';
import { MerchantGroup } from '../../../../models/get-merchant-group-response.model';
import { SimplebarAngularComponent } from 'simplebar-angular';
import { Tenant } from 'src/app/merchant/models/tenant.model';

@Component({
  selector: 'merchant-group-management',
  templateUrl: './merchant-group-management.component.html',
  styleUrls: ['./merchant-group-management.component.scss']
})
export class MerchantGroupManagementComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild('foundMerchantList') foundMerchantList!: SimplebarAngularComponent;

  readonly FAIL_RETRIEVE_DEFAULT_PROGRAM = "Fail to retrieve the default program of the merchant group";

  merchantId: number; // Only in Edit mode
  merchantGroupId: unknown; // Only in Edit mode
  originalMerchants: SelectableMerchants[] = []; // Only in Edit mode

  selectableMerchants: SelectableMerchants[] = [];
  merchantsDictionary: Merchant[] = [];
  merchantsInGroup: SelectableMerchants[] = [];
  totalSelectedToAdd = 0;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  displayToastLatency: number = 2000;
  showTable = false;
  selectAll = false;
  tenant!: Tenant;
  foundMerchantListPageNumber: number;
  isPaginating = false;
  defaultProgramId: number = 0;

  merchantGroupFormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(127)]],
    status: [true, Validators.required],
    description: ['', Validators.maxLength(127)],
    searchCriteria: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    private merchantGroupService: MerchantGroupService,
    private readonly modalService: NgbModal,
    public merchantService: MerchantService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _tenantConfigService: TenantConfigService,
  ) {
    const tenantFromRoute = this._activatedRoute.snapshot.queryParamMap.get('tenantName');
    this.tenant = this._tenantConfigService.getTenant(tenantFromRoute);
    const idFromRoute = this._activatedRoute.snapshot.queryParamMap.get('merchantId');
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;
    this.foundMerchantListPageNumber = 1;
  }

  ngOnInit(): void {
    this.getDefaultProgram();
    this.merchantGroupService.getMerchantGroupByMerchantId(this.merchantId)
      .pipe(
        tap(() => this.isLoading$.next(true)),
      )
      .subscribe({
        next: res => {
          const result = JSON.parse(res.data);

          if (result.merchantGroups.items.length > 0) {
            const merchatGroupData = result.merchantGroups?.items[0];
            this.setMerchatGroupData(merchatGroupData);
          }
          this.isLoading$.next(false);
        },
        error: err => {
          this.isLoading$.next(false);
          this.toast.showDanger(err.error.Message ?? err.error.message);
        }
      });
  }

  ngAfterViewInit(): void {
    if (this.foundMerchantList) {
      this.foundMerchantList.SimpleBar.getScrollElement().addEventListener('scroll', (e:Event) => this.onScrollFoundMerchantList(e));
    }
  }

  setMerchatGroupData(merchatGroupData: MerchantGroup) {
    this.merchantGroupId = merchatGroupData?.merchantGroupId || 0;
    const merchant = merchatGroupData.merchant;
    this.merchantGroupFormGroup.get('name')?.setValue(merchant?.name);
    this.merchantGroupFormGroup.get('status')?.setValue(merchant?.status === 1);
    this.merchantGroupFormGroup.get('description')?.setValue(merchant?.description);
    if (merchatGroupData.merchantGroupMerchantMaps) {
      const originalMerchants =
        merchatGroupData.merchantGroupMerchantMaps
        .filter(merchant => merchant.status === true)
        .map(merchantDetail => ({
          name: merchantDetail?.merchant?.name || '',
          identityCode: merchantDetail?.merchant?.identityCode || '',
          merchantId: merchantDetail?.merchantId || 0,
          checked: false,
        }));

      this.originalMerchants = [...originalMerchants];
      this.merchantsInGroup = [...originalMerchants];
    }
  }

  getDefaultProgram() {
    this.merchantGroupService.getDefaultProgram(this.tenant.id)
      .subscribe({
        next: response => {
          if (!response.data) {
            this.toast.showDanger(this.FAIL_RETRIEVE_DEFAULT_PROGRAM);
            return;
          }

          const data = JSON.parse(response.data);
          if (!data.programs || !data.programs.items || data.programs.items.length <= 0) {
            this.toast.showDanger(this.FAIL_RETRIEVE_DEFAULT_PROGRAM);
            return;
          }
          this.defaultProgramId = data.programs.items[0].id;
        },
        error: err => {
          this.toast.showDanger(err.error.Message ?? err.message);
        }
      })
  }

  searchMerchants() {
    if (this.defaultProgramId <= 0) {
      this.toast.showDanger(this.FAIL_RETRIEVE_DEFAULT_PROGRAM);
      return;
    }

    this.showTable = true;
    const searchCriteriaQuery = this.merchantGroupFormGroup.get('searchCriteria')?.value;
    const excludedMerchantId = this.merchantsInGroup.map(x => x.merchantId).toString();

    if (!this.isPaginating) {
      this.foundMerchantListPageNumber = 1;
    }

    this.merchantGroupService.getMerchants(searchCriteriaQuery, this.foundMerchantListPageNumber, excludedMerchantId, this.defaultProgramId)
      .pipe(
        tap(() => this.isLoading$.next(true)),
      )
      .subscribe((result: any) => {
        const res = JSON.parse(result.data);
        if (result.success && res && res.merchants.items.length > 0) {
          this.merchantsDictionary = res.merchants.items;
          const merchants: SelectableMerchants[] = this.selectableMerchantFomatter(res.merchants.items);

          if (this.isPaginating) {
            // next page from the same search criteria
            this.selectableMerchants = this.selectableMerchants.concat(merchants)
          } else {
            // new search criteria
            this.selectableMerchants = merchants;
            this.totalSelectedToAdd = 0;
            this.selectAll = false;
            const scroller = this.foundMerchantList.SimpleBar.getScrollElement();

            if (scroller && scroller.scrollTop !== 0) {
              scroller.scrollTop = 0;
            }
          }
        } else {
          if (!this.isPaginating) {
            this.selectableMerchants = [];
            this.totalSelectedToAdd = 0;
            this.selectAll = false;
          }
        }
        this.isLoading$.next(false)
        this.isPaginating = false;
      });
  }

  clearSearchTerm() {
    this.merchantGroupFormGroup.get('searchCriteria')?.setValue('');
    this.selectableMerchants = [];
    this.totalSelectedToAdd = 0;
    this.selectAll = false;
    this.showTable = false;
  }

  tickToggle(i: number) {
    this.selectableMerchants[i].checked = !this.selectableMerchants[i].checked;
    this.totalSelectedToAdd = this.selectableMerchants[i].checked ? this.totalSelectedToAdd + 1 : this.totalSelectedToAdd - 1
  }

  onSelectAll() {
    this.selectAll = !this.selectAll;
    this.selectableMerchants.forEach(merchant => {
      merchant.checked = this.selectAll;
    });
    this.totalSelectedToAdd = this.selectAll === true ? this.selectableMerchants.length: 0;
  }

  navigateToMerchantDetails(event: MouseEvent, merchantId: number) {
    if (event.ctrlKey) {
      window.open(this.getUrl(merchantId), '_blank');
    } else {
      this._router.navigateByUrl(this.getUrl(merchantId));
    }
  }

  getUrl(merchantId: number) {
    return `merchants/details?tenantName=${this.tenant.name}&merchantId=${merchantId}`
  }

  addMerchants() {
    this.totalSelectedToAdd = 0;
    const list = this.selectableMerchants.filter(merchant => merchant.checked === true);
    this.merchantsInGroup = [...list, ...this.merchantsInGroup];
    if (this.merchantsInGroup.length > 0) {
      const readyToAddMerchantIds: number[] = this.merchantsInGroup.map(merchant => merchant.merchantId);
      readyToAddMerchantIds.forEach(id => {
        const selectableIndex = this.selectableMerchants.findIndex(merchant => merchant.merchantId === id);
        if (selectableIndex >= 0) {
          this.selectableMerchants.splice(selectableIndex, 1);
        }
      })
    }

  }

  selectableMerchantFomatter(merchant: Merchant[]) {
    const selectableMerchant: SelectableMerchants[] = merchant.map(merchant => ({
      name: merchant.name || '',
      identityCode: merchant.identityCode,
      merchantId: merchant.merchantId,
      checked: false
    }))
    return selectableMerchant;
  }

  removeMerchantFromSelected(i: number, id: number) {
    const index: number = this.merchantsDictionary.findIndex(merchant => merchant.merchantId === id);
    if (index > 0) {
      const removedMerchant = this.selectableMerchantFomatter([this.merchantsDictionary[index]])[0];
      this.selectableMerchants.push(removedMerchant);
    }
    this.merchantsInGroup.splice(i, 1);
  }

  navigateToMerchantGroupDetails(merchantId: number) {
    this._router.navigate(['merchants/merchant-group-details'],
      {
        queryParams: {
          tenantName: this.tenant.name,
          merchantId: merchantId
        },
        state: {
          action: "merchantMapOpen"
        }
      });
  }

  navigateToMerchantList() {
    this._router.navigate(['merchants']);
  }

  submitMerchantGroup() {
    // Check for invalid
    this.merchantGroupFormGroup.markAllAsTouched();
    if (this.merchantGroupFormGroup.invalid) { return; }
    this.merchantId ? this.updateMerchant() : this.createMerchantGroup();
  }

  createMerchantGroup() {
    const addingList = this.merchantsInGroup.length > 0 ? this.merchantsInGroup.map(detail => detail.merchantId) : [];
    const body = this.merchantGroupFormGroup.getRawValue();
    body['addMerchantGroupMerchants'] = addingList;
    this.merchantGroupService.createMerchantGroup(body)
      .pipe(
        tap(() => this.isLoading$.next(true)),
      )
      .subscribe(
        res => {
          this.isLoading$.next(false);
          if (res.success) {

            this.merchantGroupService.searchTerm = '';

            setTimeout(() => {
              this.toast.showSuccess('Merchant group created successfully');
            }, this.displayToastLatency);
            this.navigateToMerchantGroupDetails(res.data.merchantId);
          } else {
            this.toast.showDanger(res.message);
          }
        },
        err => {
          this.isLoading$.next(false);
          this.toast.showDanger(err.error.Message ?? err.error.message);
        });
  }

  updateMerchant() {
    const body = this.merchantGroupFormGroup.getRawValue();
    const removingList = [...this.originalMerchants].map(merchant => merchant.merchantId);
    this.merchantsInGroup.forEach(merchant => {
      const removedMerchantId = removingList.findIndex(merchantOriginId => merchantOriginId === merchant.merchantId);
      if (removedMerchantId >= 0) {
        removingList.splice(removedMerchantId, 1);
      }
    })

    const addingList = [...this.merchantsInGroup].map(merchant => merchant.merchantId);
    // Below is removing merchant which is in the merchantInGroup list
    this.originalMerchants.forEach(originalMerchant => {
      const merchantsInGroupIndex = addingList.findIndex(merchantId => merchantId === originalMerchant.merchantId);
      if (merchantsInGroupIndex >= 0) {
        addingList.splice(merchantsInGroupIndex, 1);
      }
    })

    body['merchantGroupId'] = this.merchantGroupId;
    body['removeMerchantGroupMerchants'] = removingList;
    body['addMerchantGroupMerchants'] = addingList;
    this.merchantGroupService.updateMerchantGroup(body)
      .pipe(
        tap(() => this.isLoading$.next(true)),
      )
      .subscribe(
        res => {
          this.isLoading$.next(false);
          if (res.success) {
            this.merchantGroupService.searchTerm = '';

            setTimeout(() => {
              this.toast.showSuccess('Merchant group updated successfully');
            }, this.displayToastLatency);
            this.navigateToMerchantGroupDetails(this.merchantId);
          } else {
            this.toast.showDanger(res.message);
          }
        },
        err => {
          this.isLoading$.next(false);
          this.toast.showDanger(err.error.message || 'Update merchant group failed!');
        });
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  openModal(index: number, id: number) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.title = 'Delete Merchant';
    modalRef.componentInstance.description =
      'AAre you sure you want to delete this Merchant';
    modalRef.componentInstance.firstButton = {
      buttonText: 'Cancel',
      buttonClass: 'btn-secondary',
    };
    modalRef.componentInstance.secondButton = {
      buttonText: 'Delete',
      buttonClass: 'btn-primary',
    };

    modalRef.closed.subscribe(btn => {
      if(btn === 'confirm') {
        this.removeMerchantFromSelected(index, id);
      }
    });
  }

  private onScrollFoundMerchantList(e: any): void {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 5 && this.showTable && this.isPaginating === false) {
      this.isPaginating = true;
      this.foundMerchantListPageNumber += 1;
      this.searchMerchants();
    }
  }
}

export interface SelectableMerchants {
  name: string;
  identityCode: string;
  merchantId: number;
  checked: boolean;
}
