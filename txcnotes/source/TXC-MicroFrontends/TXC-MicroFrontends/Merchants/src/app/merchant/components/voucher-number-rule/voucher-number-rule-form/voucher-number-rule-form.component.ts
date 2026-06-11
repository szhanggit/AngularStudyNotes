import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { VoucherNumberRule } from 'src/app/merchant/models/voucher-number-rule.model';
import { SecurityKeyService } from 'src/app/merchant/services/security-key.service';
import { VoucherNumberRuleService } from 'src/app/merchant/services/voucher-number-rule.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';

@Component({
  selector: 'app-voucher-number-rule-form',
  templateUrl: './voucher-number-rule-form.component.html',
  styleUrls: ['./voucher-number-rule-form.component.scss']
})
export class VoucherNumberRuleFormComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @Input() voucherNumberRuleForm!: FormGroup;
  @Input() merchantId!: number;
  @Input() tenant!: string;
  @Input() voucherNumberRule!: VoucherNumberRule | undefined;
  @Input() isEdit = false;
  @Input() isMerchantGroup = false;

  exampleVoucher = 'N/A';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  voucherNumberRuleAlgorithms: { id: number, name: string }[] = [];
  voucherNumberRuleBarCodes: { id: number, description: string }[] = [];
  voucherNumberRulePinCodes: { id: number, description: string }[] = [];
  voucherNumberRuleVoucherGenerators: { id: number, description: string }[] = [];
  isLoadingReference = true;

  // form
  get f(): any {
    return this.voucherNumberRuleForm.controls;
  }

  constructor(
    private readonly _voucherNumberRuleService: VoucherNumberRuleService,
    private readonly _securityKeyService: SecurityKeyService,
    private readonly _router: Router,
    _authLibraryService: AuthorizationLibraryService) {
    _authLibraryService.isLoading.next(true);
    // retrieve dropdown values
    forkJoin(
      _voucherNumberRuleService.getVoucherNumberRuleAlgorithmIds(),
      _voucherNumberRuleService.getVoucherNumberRuleBarCode(),
      _voucherNumberRuleService.getVoucherNumberRulePinCode(),
      _voucherNumberRuleService.getVoucherNumberRuleVoucherGenerator()
    ).subscribe(([res1, res2, res3, res4]) => {
      const voucherNumberRuleAlgorithmsIds = JSON.parse(res1.data).voucherNumberAlgorithms.items;
      this._voucherNumberRuleService.getVoucherNumberRuleAlgorithmNameByIds(voucherNumberRuleAlgorithmsIds.map((e: any) => e.nameId)).subscribe(res => {
        this.voucherNumberRuleAlgorithms = JSON.parse(res.data).dictionaries.map((e: any, index: number) => ({
          id: voucherNumberRuleAlgorithmsIds.find((item: any) => item.nameId == e.dictionaryId).id,
          name: e.displayName,
        }));
      });

      this.voucherNumberRuleBarCodes = res2.data.barCodeDto;
      this.voucherNumberRulePinCodes = res3.data.pinCodeDto;
      this.voucherNumberRuleVoucherGenerators = res4.data.voucherGeneratorDto;
      _authLibraryService.isLoading.next(false);

      if (!this.voucherNumberRuleAlgorithms) {
        this.voucherNumberRuleAlgorithms = [{ id: 1, name: 'Edenred Algorithm' }];
      }

      this.isLoadingReference = false;

      // check if edit mode
      if (this.isEdit) {
        // case for IN to set value pinType
        if (this.tenant === 'IN') {
          this.f.pinType.setValue(this.voucherNumberRule?.pinType?.id);
        }

        // setValues for common form group controls
        this.f.ruleName.setValue(this.voucherNumberRule?.ruleName);
        this.f.algorithmId.setValue(this.voucherNumberRule?.algorithmId);
        this.f.voucherNumberPrefix.setValue(this.voucherNumberRule?.voucherNumberPrefix);
        this.f.voucherNumberType.setValue(this.voucherNumberRule?.voucherNumberType);
        this.f.voucherNumberLength.setValue(this.voucherNumberRule?.voucherNumberLength.toString());
        this.f.voucherNumberGenerator.setValue(this.voucherNumberRule?.voucherGenerator.id);
        this.f.barcodeTypeId.setValue(this.voucherNumberRule?.barcodeType.id);
        this.f.displayVoucherNumberUnderBarcode.setValue(this.voucherNumberRule?.distVoucherNumUnderBarcode);

        // generate example when on edit mode 
        this.generateExample();
      }
    });
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

  OnSubmit(): void {
    if (this.voucherNumberRuleForm.valid) {
      this.isLoading$.next(true);
      // get the raw values on the form
      let body = { ...this.voucherNumberRuleForm.getRawValue() };
      // set the merchant id
      body.merchantId = this.merchantId;

      // check if create or edit mode
      if (!this.isEdit) {
        // call create vnr endpoints
        this._voucherNumberRuleService.createVoucherNumberRule(body, true).subscribe(
          res => {
            // if successfull navigate to merchant details
            if (res.success) {
              this.navigateToMerchantDetails('add');
            }
            this.isLoading$.next(false);
          },
          err => {
            // if there is an error, display in a toast
            let errorMessage = err.error.message ?? err.error.Message;
            if (err.error.data && err.error.data.length > 0) {
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
        this._voucherNumberRuleService.updateVoucherNumberRule(body, true).subscribe(
          res => {
            // if successfull navigate to merchant details
            if (res.success) {
              this.navigateToMerchantDetails('edit');
            }
            this.isLoading$.next(false);
          },
          err => {
            // if there is an error, display in a toast
            let errorMessage = err.error.message ?? err.error.Message;
            if (err.error.data && err.error.data.length > 0) {
              errorMessage = `${err.error.data}`;
            }
            this.toast.showDanger(errorMessage);
            this.isLoading$.next(false);
          });
      }
    }
  }

  // generate example using prefix, length and pure/letter digital value
  generateExample() {
    if (this.f.voucherNumberLength.value && this.f.voucherNumberLength.valid) {
      // generate example using generateSecurityKey, length and pure/letter digital are supplied as params
      this.exampleVoucher = this._securityKeyService.generateSecurityKey(Number.parseInt(this.f.voucherNumberLength.value) - 1, this.f.voucherNumberType.value === 1);

      // concat prefix value to example voucher
      if (this.f.voucherNumberPrefix.value) {
        this.exampleVoucher = this.f.voucherNumberPrefix.value + this.exampleVoucher;
      }
    } else {
      // if no value for length or length is invalid put N/A
      this.exampleVoucher = 'N/A';
    }
  }

  navigateToMerchantDetails(action: string) {
    const navigationPath: string = this.isMerchantGroup ? 'merchants/merchant-group-details' : 'merchants/details';

    if (action === 'add') {
      // navigate to details, add vnrCreated state when on createMode
      this._router.navigate([navigationPath],
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
      // navigate to details, add vnrUpdated state when on createMode
      this._router.navigate([navigationPath],
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
      // navigate to details, add vnrUpdated state when on createMode
      this._router.navigate([navigationPath],
        {
          queryParams: {
            tenantName: this.tenant,
            merchantId: this.merchantId,
          },
          state: {
            action: 'vnrCancelled',
          }
        });
    }
  }
}
