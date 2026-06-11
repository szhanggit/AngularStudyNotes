import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-date-info',
  templateUrl: './edit-date-info.component.html',
  styleUrls: ['./edit-date-info.component.scss']
})
export class EditDateInfoComponent implements OnInit {

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
