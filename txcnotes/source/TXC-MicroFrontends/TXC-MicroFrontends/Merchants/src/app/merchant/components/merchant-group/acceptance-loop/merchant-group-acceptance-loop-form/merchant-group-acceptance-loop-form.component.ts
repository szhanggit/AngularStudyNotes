import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { concatMap, forkJoin, map, mergeMap, Observable, throwError } from 'rxjs';
import { AcceptanceLoopMerchantGroup, AcceptanceLoopMerchantGroupMerchant, ShopSelectedType, AcceptanceLoopMerchantShop } from 'src/app/merchant/models/acceptance-loop.model';
import { AcceptanceLoopApiService } from 'src/app/merchant/services/acceptance-loop-api.service';
import { MerchantGroupService } from 'src/app/merchant/services/merchant-group.service';
import { MerchantGroupAcceptanceLoopShopComponent } from '../merchant-group-acceptance-loop-shop/merchant-group-acceptance-loop-shop.component';

const internalConstants = {
  UnableToRetrieveMerchantData: "Unable to retrieve merchant data",
  UnableToOpenModal: "unable to open modal",
  merchantGroupDetailsUrl: "merchants/merchant-group-details"
}
@Component({
  selector: 'app-merchant-group-acceptance-loop-form',
  templateUrl: './merchant-group-acceptance-loop-form.component.html',
  styleUrls: ['./merchant-group-acceptance-loop-form.component.scss'],
})
export class MerchantGroupAcceptanceLoopFormComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @Input() merchantId!: number;
  @Input() acceptanceLoopFormGroup!: FormGroup;
  @Input() acceptanceLoopId!: number;
  @Input() acceptanceLoopMerchantId!: number;

  tenantConfigService: any;
  selectedMerchantName: string = "";
  isAllMerchantSelected: boolean = false;

  acceptanceLoopModel: AcceptanceLoopMerchantGroup = {
    name: '',
    description: '',
    status: true,
    merchantGroupId: 0,
    acceptanceLoopMerchants: [],
    acceptanceLoopId: 0
  };

  totalCountOfSelection: number = 0;

  get isEdit(): boolean {
    return this.acceptanceLoopId !== 0
  }

  constructor(
    private readonly router: Router,
    private merchantGroupService: MerchantGroupService,
    private acceptanceLoopApiService: AcceptanceLoopApiService,
    private readonly modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.getMerchants();
  }

  private getMerchants() {
    let merchants$: Observable<any> = this.merchantGroupService.getMerchantGroupByMerchantId(this.merchantId)
    merchants$ = merchants$.pipe(
      concatMap(merchantGroup => {
        this.setMerchantGroup(merchantGroup);
        const merchantIds = this.acceptanceLoopModel.acceptanceLoopMerchants.map((x: any) => x.merchantId)
        const merchantActiveShopCount$ = this.merchantGroupService.getShopCountByMerchantIds(merchantIds, 1);
        const merchantAllShopCount$ = this.merchantGroupService.getShopCountByMerchantIds(merchantIds);

        return forkJoin([merchantActiveShopCount$, merchantAllShopCount$]).pipe(
          map(response => {
            const activeShopCounts = JSON.parse(response[0].data).shopCountByMerchantIds;
            const allShopCounts = JSON.parse(response[1].data).shopCountByMerchantIds;

            this.acceptanceLoopModel.acceptanceLoopMerchants.forEach((merchant) => {
              const activeShopCount = activeShopCounts.find((x: any) => merchant.merchantId === x.id);
              const allShopCount = allShopCounts.find((x: any) => merchant.merchantId === x.id);

              merchant.merchantActiveShopCount = activeShopCount?.count || 0;
              merchant.merchantAllShopCount = allShopCount?.count || 0;
              merchant.status = false;
              merchant.selectedShopCount = merchant.merchantActiveShopCount;

              if (!this.isEdit) {
                merchant.availableShopCount = merchant.merchantActiveShopCount;
                merchant.status = true;
                this.isAllMerchantSelected = true;
              }
            })
          })
        )
      })
    )

    if (this.isEdit) {
      merchants$ = merchants$.pipe(
        concatMap(_ => {
          const acceptacneLoopShopCounts$ = this.acceptanceLoopApiService
            .getAcceptanceLoopsAggregationByMerchantGroupId(this.acceptanceLoopModel.merchantGroupId, 0, 1, this.acceptanceLoopId, false)

          return acceptacneLoopShopCounts$.pipe(
            map(response => {
              const data = JSON.parse(response.data).acceptanceLoopsAggregation.items[0]
              this.acceptanceLoopFormGroup.setValue({
                code: data.code,
                description: data.description,
                lastUpdatedOn: data.lastUpdatedOn
              });

              const merchants = data.merchantAggregation;
              const selectedMerchants = merchants.filter((x: any) => x.status === true);

              this.isAllMerchantSelected = merchants.length === selectedMerchants.length;
              this.acceptanceLoopModel.acceptanceLoopMerchants.forEach((merchant) => {
                const acceptance_loop_merchant = merchants.find((x: any) => merchant.merchantId === x.merchantId);

                if (acceptance_loop_merchant) {
                  merchant.status = acceptance_loop_merchant.status;
                  merchant.acceptanceLoopMerchantId = acceptance_loop_merchant.acceptanceLoopMerchantId;
                  merchant.selectedShopCount = acceptance_loop_merchant.selectedShopCount;
                  merchant.availableShopCount = acceptance_loop_merchant.availableShopCount;
                  merchant.merchantInactiveShopCount = acceptance_loop_merchant.merchantInactiveShopCount;
                  merchant.merchantActiveShopCount = acceptance_loop_merchant.merchantActiveShopCount;
                  merchant.merchantAllShopCount = merchant.merchantInactiveShopCount + merchant.merchantActiveShopCount;
                  return;
                }

                merchant.status = false;
                merchant.selectedShopCount = 0;
              })
            })
          );
        })
      )
    }

    merchants$.subscribe({
      error: (err) => {
        this.toast.showDanger(err.error.Message ?? err.message);
      },
      complete: () => {
        this.acceptanceLoopModel.acceptanceLoopId = this.acceptanceLoopId;
        this.updateTotalCountOfSelection();
      }
    })
  }

  private setMerchantGroup(response: any) {
    const merchantGroups = JSON.parse(response.data).merchantGroups;

    if (!merchantGroups || merchantGroups?.items.length <= 0) {
      this.toast.showDanger(internalConstants.UnableToRetrieveMerchantData)
      throw throwError(() => new Error(internalConstants.UnableToRetrieveMerchantData));
    }

    const merchantGroup = merchantGroups.items[0]
    const merchants = merchantGroup.merchantGroupMerchantMaps.filter((x: any) => x.status === true);

    this.acceptanceLoopModel.name = merchantGroup.merchant.name;
    this.acceptanceLoopModel.merchantGroupId = merchantGroup.merchantGroupId;

    merchants.forEach((merchant: any) => {
      this.acceptanceLoopModel.acceptanceLoopMerchants
        .push(<AcceptanceLoopMerchantGroupMerchant>{
          merchantId: merchant.merchantId,
          acceptanceLoopMerchantId: 0,
          shopSelectedType: this.isEdit ? ShopSelectedType.none : ShopSelectedType.includeAllShop,
          status: false,
          selectedShopCount: 0,
          availableShopCount: 0,
          merchantInactiveShopCount: 0,
          merchantActiveShopCount: 0,
          merchantAllShopCount: 0,
          merchantName: merchant.merchant.name,
          acceptanceLoopMerchantShops: []
        });
    })
  }

  public updateTotalCountOfSelection() {
    this.totalCountOfSelection = this.acceptanceLoopModel
      .acceptanceLoopMerchants
      .map((x) => x.selectedShopCount)
      .reduce((partialSum, a) => partialSum + a, 0);
  }

  public navigateToMerchantGroupDetails() {
    this.router.navigate([internalConstants.merchantGroupDetailsUrl],
      {
        queryParams: {
          merchantId: this.merchantId
        },
        state: {
          action: 'acceptanceLoopOpen',
        }
      });
  }

  public onSubmit() {
    this.acceptanceLoopModel.name = this.acceptanceLoopFormGroup.get('code')?.value;
    this.acceptanceLoopModel.description = this.acceptanceLoopFormGroup.get('description')?.value;
    let message = `${this.isEdit ? "Update" : "Create"} acceptance loop failed! `;

    const submit$ = this.isEdit ?
      this.merchantGroupService.updateAcceptanceLoop(this.acceptanceLoopModel) :
      this.merchantGroupService.createAcceptanceLoop(this.acceptanceLoopModel)

    submit$.subscribe({
      next: (response) => {
        if (response.success === true) {
          setTimeout(() => {
            message = `Acceptance loop ${this.isEdit ? "updated" : "created"} successfully`;
            this.toast.showSuccess(message);
          }, 2000);
          this.navigateToMerchantGroupDetails();
        }
      },
      error: (err) => {
        if (err.error.data && err.error.data.length > 0) {
          message += err.error.data.join(' ')
        } else if (err.error.message) {
          message += err.error.message
        } else if (err.message) {
          message += err.message
        }
        this.toast.showDanger(message);
      }
    })
  }

  public toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl, message: string = '') {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl, message });
    }
  }

  public openModal(merchantId: number) {
    const modalRef = this.modalService.open(MerchantGroupAcceptanceLoopShopComponent, { backdrop: 'static' });
    const merchant = this.acceptanceLoopModel.acceptanceLoopMerchants
      .find((x) => x.merchantId === merchantId);

    if (!merchant) {
      this.toast.showDanger(internalConstants.UnableToOpenModal);
      return
    }

    const merchantShops = merchant.acceptanceLoopMerchantShops
      .map((x) => ({
        isSelected: x.status,
        shopId: x.shopId,
        shopStatus: x.shop[0].status,
        hasChanged: false
      }));

    modalRef.componentInstance.shopModalInfo = {
      merchantId,
      mode: 1,
      title: `Select Shops for ${merchant.merchantName}`,
      acceptanceLoopId: this.acceptanceLoopModel.acceptanceLoopId,
      acceptanceLoopMerchantId: merchant.acceptanceLoopMerchantId,
      acceptanceLoopMerchantShops: merchantShops,
      acceptanceLoopLastUpdatedOn: new Date(this.acceptanceLoopFormGroup.get("lastUpdatedOn")?.value),
      shopSelectedType: merchant.shopSelectedType,
      selectedShopCount: merchant.selectedShopCount,
      merchantAllShopCount: merchant.merchantAllShopCount,
      IsCountedByActiveShopOnly: false
    };

    modalRef.closed.subscribe(data => this.closeModal(data, merchantId));
  }

  private closeModal(data: any, merchantId: number) {
    if (!data)
      return;

    const merchant = this.acceptanceLoopModel.acceptanceLoopMerchants
      .find((x) => x.merchantId === merchantId);

    if (!merchant || !merchant.acceptanceLoopMerchantShops)
      return;

    merchant.shopSelectedType = data.shopSelectedType;

    //the shops that have been updated in the modal
    merchant.acceptanceLoopMerchantShops = data.acceptanceLoopMerchantShops
      .map((x: any) => <AcceptanceLoopMerchantShop>{
        shopId: x.shopId,
        status: x.isSelected,
        acceptanceLoopMerchantShopId: 0,
        hasChanged: x.hasChanged,
        shop: [{
          status: x.shopStatus
        }]
      });

    const updatedActiveShops = merchant.acceptanceLoopMerchantShops
      .filter((x) => x.hasChanged &&
        x.shop.filter((y) => y.status === 1).length === 1);

    const unselectedActiveShopCount = updatedActiveShops.filter(x => x.status === false).length;
    const selectedActiveShopCount = updatedActiveShops.filter(x => x.status === true).length;

    merchant.selectedShopCount = data.selectedShopCount;

    if (merchant.selectedShopCount === merchant.merchantAllShopCount) {
      merchant.availableShopCount = merchant.merchantActiveShopCount;
      return;
    }

    if (merchant.selectedShopCount === 0) {
      merchant.availableShopCount = 0;
      return;
    }

    if (data.IsCountedByActiveShopOnly) {
      merchant.availableShopCount = selectedActiveShopCount;
      return;
    }

    merchant.availableShopCount += selectedActiveShopCount - unselectedActiveShopCount;
    this.updateTotalCountOfSelection();
  }

  public onSelectAllMerchant(): void {
    this.isAllMerchantSelected = !this.isAllMerchantSelected;

    this.acceptanceLoopModel.acceptanceLoopMerchants.forEach((merchant: AcceptanceLoopMerchantGroupMerchant) => {
      merchant.status = this.isAllMerchantSelected
    });
  }

  public onSelectMerchant(merchant: AcceptanceLoopMerchantGroupMerchant): void {
    merchant.status = !merchant.status

    const unselectedMerchants = this.acceptanceLoopModel
      .acceptanceLoopMerchants
      .filter((x: AcceptanceLoopMerchantGroupMerchant) => x.status === false);

    this.isAllMerchantSelected = unselectedMerchants.length === 0;
  }
}
