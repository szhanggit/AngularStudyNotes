import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-download-remaining-voucher-details',
  templateUrl: './download-remaining-voucher-details.component.html',
  styleUrls: ['./download-remaining-voucher-details.component.scss']
})
export class DownloadRemainingVoucherDetailsComponent implements OnInit {

  form: FormGroup;
  isFormInvalid : boolean= false;
  constructor(public activeModal: NgbActiveModal, public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      merchantSKUName: ['', [Validators.required]],
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
