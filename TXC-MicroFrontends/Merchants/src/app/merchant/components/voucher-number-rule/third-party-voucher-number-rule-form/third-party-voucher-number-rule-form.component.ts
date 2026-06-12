import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { Vendor } from 'src/app/merchant/models/vendor.model';
import { VoucherNumberRule } from 'src/app/merchant/models/voucher-number-rule.model';
import { MerchantService } from 'src/app/merchant/services/merchant.service';
import { ProgramService } from 'src/app/merchant/services/program.service';
import { VendorService } from 'src/app/merchant/services/vendor.service';
import { VoucherNumberRuleService } from 'src/app/merchant/services/voucher-number-rule.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';

@Component({
  selector: 'app-third-party-voucher-number-rule-form',
  templateUrl: './third-party-voucher-number-rule-form.component.html',
  styleUrls: ['./third-party-voucher-number-rule-form.component.scss']
})
export class ThirdPartyVoucherNumberRuleFormComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @Input() voucherNumberRuleForm!: FormGroup;
  @Input() merchantId!: number;
  @Input() tenant!: string;
  @Input() voucherNumberRule!: VoucherNumberRule | undefined;
  @Input() isEdit = false;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  voucherNumberRuleBarCodes: { id: number, description: string }[] = [];
  voucherNumberRulePinCodes: { id: number, description: string }[] = [];
  isLoadingReference = true;
  vendors: Vendor[] = [];

  // form
  get f(): any {
    return this.voucherNumberRuleForm.controls;
  }

  constructor(
    private readonly _voucherNumberRuleService: VoucherNumberRuleService,
    private readonly _router: Router,
    private readonly _merchantService: MerchantService,
    private readonly _programService: ProgramService,
    private readonly _vendorService: VendorService,
    _authLibraryService: AuthorizationLibraryService) {
    _authLibraryService.isLoading.next(true);
    // retrieve dropdown values
    forkJoin(
     [ _voucherNumberRuleService.getVoucherNumberRuleBarCode(),
      _voucherNumberRuleService.getVoucherNumberRulePinCode(),]
    ).subscribe(([res1, res2]) => {
      this.voucherNumberRuleBarCodes = res1.data.barCodeDto;
      this.voucherNumberRulePinCodes = res2.data.pinCodeDto;
      _authLibraryService.isLoading.next(false);

      this.isLoadingReference = false;
      this.getVendorList();
      // check if edit mode
      if (this.isEdit) {

        // case for IN to set value pinType
        if (this.tenant === 'IN') {
          this.f.pinType.setValue(this.voucherNumberRule?.pinType?.id);
        }

        // case for TW to set value for multipartbarcode
        if (this.tenant === 'TW') {
          this.f.hasMultipartBarcode.setValue(this.voucherNumberRule?.hasMultipleBarcode);
        }

        // set value for common fields
        this.f.displayVoucherNumberUnderBarcode.setValue(this.voucherNumberRule?.distVoucherNumUnderBarcode);
        this.f.barcodeTypeId.setValue(this.voucherNumberRuleBarCodes.find(barCode => barCode.description === this.voucherNumberRule?.barcodeType?.description)?.id);
        this.f.ruleName.setValue(this.voucherNumberRule?.ruleName);
        this.f.requestExpiryDate.setValue(this.voucherNumberRule?.requestExpiryDate);
        this.f.onDemand.setValue(this.voucherNumberRule?.onDemand);
        this.f.vendorId.setValue(this.voucherNumberRule?.vendor?.id);
      }
    });

  }

  ngOnInit(): void {

    this._merchantService.getMerchantById(this.merchantId).subscribe(
      (res) => {
        const merchant = res.data.merchantDetails[0];
        // get programById using graphql endpoint
        this._programService.getProgramId(merchant.programId).subscribe(res => {
          this.f.programName.setValue(JSON.parse(res.data).programs.items[0].displayName);
        });
      });

    // dynamic validation for vendorId if onDemand is on/off
    this.f.ruleName.valueChanges.subscribe((value: boolean) => {
      const onDemandVal = this.f.onDemand.value;
      if (onDemandVal) {
        this.f.vendorId.setValidators(Validators.required);
        this.f.vendorId.setValue('');
        this.f.vendorId.updateValueAndValidity();
      } else {
        this.f.vendorId.clearValidators();
        this.f.vendorId.setValue('');
        this.f.vendorId.updateValueAndValidity();
      }
    });

    this.f.onDemand.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.f.vendorId.setValidators(Validators.required);
        this.f.vendorId.updateValueAndValidity();
        this.f.vendorId.setValue('');
        this.f.vendorId.markAsDirty();
      } else {
        this.f.vendorId.clearValidators();
        this.f.vendorId.setValue('');
        this.f.vendorId.updateValueAndValidity();
      }
    });
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  getVendorList() {
    const tenant = this.tenant.toLowerCase();
    this._vendorService.getAllVendors(tenant).subscribe((res: any) => {
      this.vendors = res.Data.map((vendorData: any) => ({
          id: vendorData.Id,
          name: vendorData.Name,
          vendorCode: vendorData.VendorCode,
      }));
    });
  }

  OnSubmit(): void {
    if (this.voucherNumberRuleForm.valid) {
      this.isLoading$.next(true);
      // get the raw values on the form
      let body = { ...this.voucherNumberRuleForm.getRawValue() };
      // set the merchant id
      body.merchantId = this.merchantId;
      body.vendorId = +body.vendorId;
      // check if create or edit mode
      if (!this.isEdit) {
        // call create vnr endpoints
        this._voucherNumberRuleService.createVoucherNumberRule(body, false).subscribe(
          res => {
            // if successfull navigate to merchant details
            if (res.success) {
              this.navigateToMerchantDetails('add');
              this.isLoading$.next(false);
            }
          },
          err => {
            // if there is an error, display in a toast
            let errorMessage = err.error.message;
            if (err.error.data.length > 0) {
              errorMessage = `${err.error.data}`;
            }
            this.toast.showDanger(errorMessage);
            this.isLoading$.next(false);
          });
      } else {
        // set these 2 values when edit mode
        body.voucherNumberRuleId = this.voucherNumberRule?.voucherNumberRuleId;
        body.barcodeType = body.barcodeTypeId;

        // call edit vnr endpoint
        this._voucherNumberRuleService.updateVoucherNumberRule(body, false).subscribe(
          res => {
            // if successfull navigate to merchant details
            if (res.success) {
              this.navigateToMerchantDetails('edit');
              this.isLoading$.next(false);
            }
          },
          err => {
            // if there is an error, display in a toast
            let errorMessage = err.error.message;
            if (err.error.data.length > 0) {
              errorMessage = `${err.error.data}`;
            }
            this.toast.showDanger(errorMessage);
            this.isLoading$.next(false);
          });
      }


    }
  }

  navigateToMerchantDetails(action: string) {
    if (action === 'add') {
      // navigate to details, add vnrCreated state when on createMode
      this._router.navigate(['merchants/details'],
        {
          queryParams: {
            tenantName: this.tenant,
            merchantId: this.merchantId
          },
          state: {
            action: 'vnrCreated',
            vnrName: this.f.ruleName.value
          }
        });
    } else if (action === 'edit') {
      // navigate to details, add vnrUpdated state when on editMode
      this._router.navigate(['merchants/details'],
        {
          queryParams: {
            tenantName: this.tenant,
            merchantId: this.merchantId
          },
          state: {
            action: 'vnrUpdated',
            vnrName: this.f.ruleName.value
          }
        });
    } else {
      // navigate to details, add vnrCancelled state
      this._router.navigate(['merchants/details'],
        {
          queryParams: {
            tenantName: this.tenant,
            merchantId: this.merchantId
          }, state: {
            action: 'vnrCancelled'
          }
        });
    }
  }
}
