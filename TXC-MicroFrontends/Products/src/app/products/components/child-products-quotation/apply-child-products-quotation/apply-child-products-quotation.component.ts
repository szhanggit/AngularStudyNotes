import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorMessage } from 'src/app/products/models/error-message.model';
import { ConfirmationModalComponent, NgbdToastGlobal } from '@txc-angular/component-library';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-apply-child-products-quotation',
  templateUrl: './apply-child-products-quotation.component.html',
  styleUrls: ['./apply-child-products-quotation.component.scss']
})
export class ApplyChildProductsQuotationComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  searchQuotationForm!: FormGroup;
  failedErrorMessages: ErrorMessage[] = [];

  quotationFile!: File | null;
  isApplyDisabled: boolean = true; 
  isUploadFormHidden: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private modalSvc: NgbModal,
    ) { }

  ngOnInit(): void {
    this.initializeQuotationForm();
  }

  private initializeQuotationForm() {
    this.searchQuotationForm = this.formBuilder.group({
      masterProductCode : new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
    });
  }

  searchQuotation() {
    const errorCommaSpace = /,| /;
    if(errorCommaSpace.test(this.searchQuotationForm.get('masterProductCode')?.value)) {
      this.failedErrorMessages = [
        {
          type : 'ProductCode',
          description : 'Product code should be divided by line(row). All the other formats are not acceptable.'
        }
      ];
      return;
    }
    let masterProductCodes = this.searchQuotationForm.get('masterProductCode')?.value?.split(/\n/);
    masterProductCodes = masterProductCodes.filter((codes:string) => codes);
    this.failedErrorMessages = [];

    if (masterProductCodes.length > 0) {
      this.isUploadFormHidden = false;
      this.searchQuotationForm.disable();
    } else {
      this.toast.showDanger('Please enter valid master product codes.');
    }
  }

  OnQuotationFileChanged(event: File | null) {
    if(event) {
      this.isApplyDisabled = false;
    } else {
      this.isApplyDisabled = true;
    }
    this.quotationFile = event;
  }

  onReset() {
    const modalRef = this.modalSvc.open(
      ConfirmationModalComponent,
      {
        size: 'md',
        backdrop: 'static',
        centered: true,
      }
    );
    modalRef.componentInstance.title = 'Reset quotation';
    modalRef.componentInstance.description =
      'Are you sure you want to reset? The template and the searched master product codes would be reseted.';
      modalRef.componentInstance.firstButton = {
        buttonText: 'Cancel',
        buttonClass: 'btn-secondary',
      };
      modalRef.componentInstance.secondButton = {
        buttonText: 'Reset',
        buttonClass: 'btn-primary',
      };
    modalRef.result.then((res: string) => {
      if (res === 'confirm') this.onResetForms();
    });
  }

  onApply() {
    this.onResetForms();
    this.isApplyDisabled = true;
    this.toast.showSuccess('You’ve successfully applied child products to quotation.')
  }

  private onResetForms() {
    this.isUploadFormHidden = true;
    this.searchQuotationForm.get('masterProductCode')?.reset();
    this.searchQuotationForm.enable();
    this.quotationFile = null;
    this.isApplyDisabled = true;
  }
}
