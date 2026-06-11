import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCollapse, NgbModal, NgbModalConfig, NgbModalRef, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcceptanceLoopCreateRequest, AcceptanceLoopEditRequest, AcceptanceLoopMerchantShop, AcceptanceLoopMerchantShopRequest, OpenMode, ShopOption } from 'src/app/merchant/models/acceptance-loop.model';
import { AcceptanceLoopApiService } from 'src/app/merchant/services/acceptance-loop-api.service';
import { AcceptanceLoopService } from 'src/app/merchant/services/acceptance-loop.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { AcceptanceLoopShopComponent } from '../acceptance-loop-shop/acceptance-loop-shop.component';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';

@Component({
  selector: 'app-acceptance-loop-form',
  templateUrl: './acceptance-loop-form.component.html',
  styleUrls: ['./acceptance-loop-form.component.scss']
})
export class AcceptanceLoopFormComponent implements OnInit, OnDestroy {

  @Input() merchantId!: number;
  @Input() acceptanceLoopId!: number;
  @Input() acceptanceLoopMerchantId!: number;
  @Input() acceptanceLoopFormGroup!: FormGroup;
  @Input() isEdit = false;

  @ViewChild('selectedListCollapse') selectedListCollapse!: NgbCollapse;
  @ViewChild('unselectedListCollapse') unselectedListCollapse!: NgbCollapse;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild('popup') popupMessageModal!: NgbModal;

  selectedListCollapsed = false;
  unselectedListCollapsed = false;

  totalSelected$: Observable<number>;
  totalUnselected$: Observable<number>;
  shopOptions$: Observable<ShopOption[]>;

  totalSelected: number = 0;
  totalUnselected: number = 0;
  shopOptions: ShopOption[] = [];

  subscriptions: Subscription[] = [];

  popupMessageString: string = '';
  popupModalRef: NgbModalRef | null = null;

  userName : string = '';

  get itemStartSelected() {
    return this.acceptanceLoopService.pageSelected === 1 ? 1 : this.totalSelected < 1 ? this.totalSelected : (((this.acceptanceLoopService.pageSelected - 1) * this.acceptanceLoopService.pageSize) + 1);
  }
  get itemStartUnselected() {
    return this.acceptanceLoopService.pageUnselected === 1 ? 1 : this.totalUnselected < 1 ? this.totalUnselected : (((this.acceptanceLoopService.pageUnselected - 1) * this.acceptanceLoopService.pageSize) + 1);
  }
  get itemEndSelected() {
    return this.acceptanceLoopService.pageSelected === this.pageCountSelected || this.totalSelected < this.acceptanceLoopService.pageSelected * this.acceptanceLoopService.pageSize ? this.totalSelected : this.acceptanceLoopService.pageSelected * this.acceptanceLoopService.pageSize;
  }
  get itemEndUnselected() {
    return this.acceptanceLoopService.pageUnselected === this.pageCountUnselected || this.totalUnselected < this.acceptanceLoopService.pageUnselected * this.acceptanceLoopService.pageSize ? this.totalUnselected : this.acceptanceLoopService.pageUnselected * this.acceptanceLoopService.pageSize;
  }
  get pageCountSelected() {
    return Math.ceil(this.totalSelected / this.acceptanceLoopService.pageSize);
  }
  get pageCountUnselected() {
    return Math.ceil(this.totalUnselected / this.acceptanceLoopService.pageSize);
  }

  // form
  get f(): any {
    return this.acceptanceLoopFormGroup.controls;
  }

  constructor(
    public acceptanceLoopService: AcceptanceLoopService,
    private readonly acceptanceLoopApiService: AcceptanceLoopApiService,
    private modalConfig: NgbModalConfig,
    private readonly modalService: NgbModal,
    private readonly router: Router,
    private readonly tenantConfigService: TenantConfigService,
    private readonly authSvc : AuthorizationLibraryService) {
    
    this.shopOptions$ = acceptanceLoopService.shopOptions$;
    this.totalSelected$ = acceptanceLoopService.totalSelected$;
    this.totalUnselected$ = acceptanceLoopService.totalUnselected$;
  
    this.subscriptions.push(
      this.shopOptions$.subscribe(x => this.shopOptions = x ),
      this.totalSelected$.subscribe(x => this.totalSelected = x ),
      this.totalUnselected$.subscribe(x => this.totalUnselected = x)
    );

    this.authSvc.userAuthClaim.subscribe(data =>
      {
        this.userName = data.user.userName?data.user.userName:"";
      });

    this._ModalConfigSetup();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.subscriptions) {
      this.subscriptions.forEach(x => x.unsubscribe());
    }
  }

  private _ModalConfigSetup() {
    this.modalConfig.backdrop = 'static';
    this.modalConfig.keyboard = false;
  }

  selectedShopOptions(selected: boolean): Observable<ShopOption[]> {
    return this.shopOptions$.pipe(map(x => {
      if (x) {
        return x.filter(s => s.isSelected === selected)
      }
      return x;
    }));
  }

  OnSubmit() {
    if (this.isEdit) {
      this.updateAcceptanceLoop();
    }
    else {
      this.createAcceptanceLoop();
    }
  }

  // TODO: "status" fields clarification
  createAcceptanceLoop() {
    let createdAcShops: AcceptanceLoopMerchantShopRequest[] =
      this.shopOptions.filter(x => x.shopId && x.shopId > 0 && x.isSelected).map<AcceptanceLoopMerchantShopRequest>(shop => {
        const acShop: AcceptanceLoopMerchantShopRequest = {
          shopId: shop.shopId ?? 0,
          status: true
        }
        return acShop;
      });
    if(createdAcShops.length <= 0){
      this.openPopup('Unable to create this new acceptance loop due to lack of shops. Select at least 1 shop to create acceptance loop, Please select shops.');
    }
    else{
      const req: AcceptanceLoopCreateRequest = {
        acceptanceLoopId : 0,
        code: this.acceptanceLoopFormGroup.get('code')?.value,
        description: this.acceptanceLoopFormGroup.get('description')?.value,
        status: true,
        isDefault: false,
        createdBy: this.userName,  // TODO: should be the user
        createdOn : new Date(),
        acceptanceLoopMerchants: [{
          merchantId: this.merchantId,
          status: true,
          acceptanceLoopMerchantShops: createdAcShops.length > 0 ? createdAcShops : []
        }]
      };

      this.acceptanceLoopApiService.createAcceptanceLoop(req).subscribe(
        res => {
          if(res.success) {
            this.toast.showSuccess(`Acceptance loop ${req.code} was successfully created.`);
            // TODO: navigate to acceptance loop list page if the user is coming from there
            this.navigateToMerchantDetails();
          }
          else {
            this.openPopup(`Unable to create this new acceptance loop because ${res.message}, please modify.`);
          }
        },
        err => {
          this.openPopup(`Unable to create this new acceptance loop because ${err.error.message}, please modify.`);
        }
      );
    }
  }

  // TODO: "status" fields clarification
  updateAcceptanceLoop() {
    let createdAcShops: AcceptanceLoopMerchantShopRequest[] = [];
    let editedAcShops: AcceptanceLoopMerchantShopRequest[] = [];

    this.shopOptions.forEach(shop => {
      if (shop.isSelected != shop.isSelectedOrigin) {

        // shop exists in AcceptanceLoopMerchantShop table
        if (shop.acceptanceLoopMerchantShopId > 0) {
          editedAcShops.push({
            acceptanceLoopMerchantShopId: shop.acceptanceLoopMerchantShopId,
            shopId: shop.shopId ?? 0, 
            status: shop.isSelected
          });
        }

        // shop does not exist in AcceptanceLoopMerchantShop table
        else {
          createdAcShops.push({
            shopId: shop.shopId ?? 0,
            status: shop.isSelected
          });
        }
      }
    });

    const req: AcceptanceLoopEditRequest = {
      acceptanceLoopId: this.acceptanceLoopId,
      code: this.acceptanceLoopFormGroup.get('code')?.value,
      description: this.acceptanceLoopFormGroup.get('description')?.value,
      status: true,
      isDefault : false,
      createdBy : "",
      createdOn : new Date(),
      createAcceptanceLoops: createdAcShops.length > 0 ? 
        [{
          merchantId: this.merchantId,
          status: true,
          acceptanceLoopMerchantShops: createdAcShops
        }] : [],
      editAcceptanceLoops: editedAcShops.length > 0 ?
        [{
          acceptanceLoopMerchantId: this.acceptanceLoopMerchantId,
          merchantId: this.merchantId,
          status: true,
          acceptanceLoopMerchantShops: editedAcShops
        }] : []
    }

    this.acceptanceLoopApiService.updateAcceptanceLoop(req).subscribe(
      res => {
        if(res.success) {
          this.toast.showSuccess(`Acceptance loop ${req.code} was successfully updated.`);
          // TODO: navigate to acceptance loop list page if the user is coming from there
          this.navigateToMerchantDetails();
        }
        else {
          this.openPopup(`Unable to update this acceptance loop because ${res.message}, please modify.`);
        }
      },
      err => {
        this.openPopup(`Unable to update this acceptance loop because ${err.error.message}, please modify.`);
      }
    );
  }

  removeSelectedShop(shopOption: ShopOption) {
    shopOption.isSelected = false;
    this.acceptanceLoopService.refreshShopOptions(this.shopOptions);
  }

  selectShops() {
    this.shopOptions.forEach(x => x.isSelected = true);
    if(this.isEdit)
    this.openModal(OpenMode.edit);
    else
    this.openModal(OpenMode.create);
  }

  editSelection() {
    if(this.isEdit)
    this.openModal(OpenMode.edit);
    else
    this.openModal(OpenMode.create);
  }

  openModal(openMode: OpenMode) {
    const modalRef = this.modalService.open(AcceptanceLoopShopComponent);

    modalRef.componentInstance.shopModalInfo = {
      merchantId: this.merchantId,
      acceptanceLoopId: this.acceptanceLoopId,
      mode: openMode,
      acceptanceLoopMerchantShops: JSON.parse(JSON.stringify(this.shopOptions)),
      title: 'Select Shops',
      acceptanceLoopLastUpdateDate : this.acceptanceLoopFormGroup.get('lastUpdatedOn')?.value
    };

    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.acceptanceLoopService.refreshShopOptions(receivedEntry);
    })
  }

  openPopup(message: string) {
    this.popupMessageString = message;
    this.popupModalRef = this.modalService.open(this.popupMessageModal,  { centered: true });
  }

  closePopup(mode?: string) {
    if (this.popupModalRef) {
      this.popupModalRef.close();
    }

    switch(mode) {
      case 'discard':
        this.navigateToMerchantDetails();
        break;
      default:
        // Do nothing
    }
  }

  navigateToMerchantDetails() {
    this.router.navigate(['merchants/details'],
    {
      queryParams: {
        tenantName: this.tenantConfigService.getTenant().name,
        merchantId: this.merchantId
      },
      state: {
        action: 'acceptanceLoopOpen',
      }
    });
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl,message : string = '') {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl, message });
    }
  }

  toggle(name: string) {
    switch(name) {
      case 'SELECTED':
        this.selectedListCollapse.toggle();
        break;
      case 'UNSELECTED':
        this.unselectedListCollapse.toggle();
        break;
    }
  }

}
