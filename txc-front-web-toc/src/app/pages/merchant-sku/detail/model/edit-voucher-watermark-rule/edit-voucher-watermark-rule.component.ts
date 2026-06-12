import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-voucher-watermark-rule',
  templateUrl: './edit-voucher-watermark-rule.component.html',
  styleUrls: ['./edit-voucher-watermark-rule.component.scss']
})
export class EditVoucherWatermarkRuleComponent implements OnInit {

  form: FormGroup;
  isFormInvalid : boolean= false;
  constructor(public activeModal: NgbActiveModal, public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      replenishmentQuantity:[''],
     instockLowWatermark : [''],
     instockHighWatermark:[''],
     cacheLowWatermark : [''],
     cacheHighWatermark : ['']
    });
  }

  onSubmit(){
    
    this.isFormInvalid =  this.form.status == "INVALID";
    if(!this.isFormInvalid){
      console.log("Output form :- ", this.form.value);
      this.activeModal.close(this.form.value);
    }
    
  }


}
