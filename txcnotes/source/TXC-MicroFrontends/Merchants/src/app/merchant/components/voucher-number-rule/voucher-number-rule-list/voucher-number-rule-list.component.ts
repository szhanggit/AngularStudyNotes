import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCollapse, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { IProgram } from 'src/app/merchant/models/program.model';
import { VoucherNumberRule } from 'src/app/merchant/models/voucher-number-rule.model';
import { VoucherNumberRuleService } from 'src/app/merchant/services/voucher-number-rule.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { environment } from 'src/environments/environment';
import { VoucherNumberRuleDeleteErrorComponent } from '../voucher-number-rule-delete-error/voucher-number-rule-delete-error.component';
import { VoucherNumberRuleDeleteComponent } from '../voucher-number-rule-delete/voucher-number-rule-delete.component';
import { UtilityService } from 'src/app/merchant/services/utility.service';

@Component({
  selector: 'app-voucher-number-rule-list',
  templateUrl: './voucher-number-rule-list.component.html',
  styleUrls: ['./voucher-number-rule-list.component.scss']
})
export class VoucherNumberRuleListComponent implements OnInit {
  @ViewChild(NgbCollapse) vnrListCollapse!: NgbCollapse;

  @Input() merchantId!: number;
  @Input() tenant!: string;
  @Input() program!: IProgram;
  @Input() isEdenredProgram = true;
  @Input() isMerchantGroup = false;
  @Input() toast!: NgbdToastGlobal;
  @Input() action!: string;

  vnrListCollapsed = true;
  voucherNumberRuleList: VoucherNumberRule[] = [];
  selectedTenantUTC!: string;

  operations: number[] = [];
  // getter for merchant viewer flag
  get isMerchantViewer(): boolean {
    return this._authLibraryService.getElementOperationFlag([environment.merchant_view_op_id, environment.merchant_create_op_id]);
  }

  // getter for merchant viewer flag
  get isMerchantEditor(): boolean {
    return this._authLibraryService.getElementOperationFlag([environment.merchant_create_op_id]);
  }

  constructor(
    private readonly _voucherNumberRuleService: VoucherNumberRuleService,
    private readonly _router: Router,
    private readonly _modalService: NgbModal,
    private readonly _authLibraryService: AuthorizationLibraryService,
    private utilityService: UtilityService) {
    // set operations values from userAuthClaim
    this.operations = this._authLibraryService.userAuthClaim.getValue().operations;
    this.selectedTenantUTC=utilityService.FetchLocalTimeFromUTC();
  }

  ngOnInit(): void {
    // retrieves the vnr list by merchant id
   
    if (this.merchantId && this.program) {
      this._voucherNumberRuleService
      .getSpecificVoucherNumberRule(this.merchantId)
      .subscribe((res) => {
        this.voucherNumberRuleList = res ?? []
        if (this.voucherNumberRuleList.length && this.action === 'vnrCancelled') {
          this.vnrListCollapsed = false;
        }
      });
    }
    else {
      this.toast?.showDanger('Voucher-Number-Rule loaded failed. Please try again later.');
    }
  }

  // expand or collapse the vnr widget
  public collapse() {
    this.vnrListCollapse.toggle()
    if (!this.vnrListCollapsed && this.merchantId) {
    }
  }

  // navigate to create vnr page
  navigateToCreateVNR() {
    if (this.merchantId) {
      this._router.navigate(['merchants/voucher-number-rule/create'],
        {
          queryParams: {
            tenantName: this.tenant,
            merchantId: this.merchantId,
            isEdenredProgram: this.program.isEdenred,
            isMerchantGroup: this.isMerchantGroup,
          }
        });
    }
  }

  // navigate to edit vnr page
  navigateToEditVNR(id: number | undefined) {
    if (this.merchantId && id) {
      this._router.navigate([`merchants/voucher-number-rule/edit/${id}`],
        {
          queryParams: {
            tenantName: this.tenant,
            merchantId: this.merchantId,
            isEdenredProgram: this.program.isEdenred,
            isMerchantGroup: this.isMerchantGroup
          }
        });
    }
  }

  // open delete confirmation modal
  openDeleteConfirmationModal(voucherNumberRule: VoucherNumberRule, index: number) {
    const modalRef = this._modalService.open(VoucherNumberRuleDeleteComponent, {
      centered: true,
      size: 'md',
      backdrop: 'static',
      modalDialogClass: 'modal-class'
    });
    modalRef.componentInstance.ruleName = voucherNumberRule.ruleName;

    // if result is confirme call through vnrService.delete method
    modalRef.result.then((result) => {
      if (result === "confirm") {
        if (voucherNumberRule.voucherNumberRuleId) {
          // call vnrService.delete method
          this._voucherNumberRuleService.deleteVoucherNumberRule(voucherNumberRule.voucherNumberRuleId).subscribe(res => {
            // remove vnr on ui and show toast
            this.voucherNumberRuleList.splice(index, 1);
            this.toast?.showSuccess(`Successfully deleted voucher number rule ${voucherNumberRule.ruleName}`);
          }, err => {
            // opens an error modal to show if there are errors after calling delete voucher number rule
            const errorModal = this._modalService.open(VoucherNumberRuleDeleteErrorComponent, {
              centered: true,
              size: 'md',
              backdrop: 'static',
              modalDialogClass: 'modal-class'
            });
            errorModal.componentInstance.errorMessage = err.error.message;
          });
        }
      }
    });
  }

}
