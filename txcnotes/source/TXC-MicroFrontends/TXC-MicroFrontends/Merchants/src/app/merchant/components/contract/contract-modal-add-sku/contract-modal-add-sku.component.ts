import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { BaseResponse } from 'src/app/merchant/services/base-response.model';
import { ContractService } from 'src/app/merchant/services/contract.service';

@Component({
  selector: 'app-contract-modal-add-sku',
  templateUrl: './contract-modal-add-sku.component.html',
  styleUrls: ['./contract-modal-add-sku.component.scss']
})
export class ContractModalAddSkuComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  
  @Input() programId!:number;
  @Input() merchantId!: number;
  @Input() contractId!: number; 
  @Input() costSchemeId!:string;
  @Input() contractStatus!: string; 

  constructor(private readonly _router: Router,
    public activeModal: NgbActiveModal,
    private contractService: ContractService) { }

  ngOnInit(): void {
  }

  navigateToCreateSKU(): void {   
    this._router.navigate(['/merchants/contract/sku/create'], 
      {
        queryParams: 
        { 
          merchantId: this.merchantId,
          contractId : this.contractId,
          status : this.contractStatus,
        } 
      });
  }
  /// <summary>
  ///  Downoad SKU import template 
  /// </summary>
  downloadSkuTemplate(): void {
    //this.isLoading$.next(true);
    this.contractService.downloadSkuTemplate(this.merchantId).subscribe({
      next: (res: any) => {
        let filename = res.headers.get('content-disposition')?.split(';')[1].split('=')[1];
        let blob: Blob = res.body as Blob;
        let a = document.createElement('a');
        a.download = filename ?? `SKU_Template_${this.merchantId}.xlsx`;
        a.href = window.URL.createObjectURL(blob);
        a.click();
        this.toast?.showSuccess("File downloaded - "+a.download);
      },
      error: err => {
        this.toast?.showDanger(err.error.Message ?? err.error.message);        
      },
    });
  }
  
}
