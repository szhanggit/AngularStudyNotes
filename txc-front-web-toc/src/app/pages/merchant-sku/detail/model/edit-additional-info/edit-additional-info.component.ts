import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-additional-info',
  templateUrl: './edit-additional-info.component.html',
  styleUrls: ['./edit-additional-info.component.scss']
})
export class EditAdditionalInfoComponent implements OnInit {

  form: FormGroup;
  isFormInvalid : boolean= false;
  constructor(public activeModal: NgbActiveModal, public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      skuMOQ : [''],
      defaultCost: [0],
      costs: new FormArray([
        this.formBuilder.group({
          //defaultCost: ['0'],
          costValue: ['', Validators.required]
        })
     ])
    });
  }

  get costs(): FormArray { 
    //console.log(this.form.get('costs') as FormArray);
    return this.form.get('costs') as FormArray; 
  }

  formGroupCtrl(fb : any) : FormGroup{
return fb as FormGroup;
  }

  addCost() { 
    this.costs.push(this.formBuilder.group({      
      costValue: ['', Validators.required]
    })); 
  }

  deleteCost(index: number) {
    this.costs.removeAt(index);
  }

  changeDefaultValue(e : any) {
    console.log(e.target.value);
    this.form.patchValue({defaultCost: e.target.value})
  }

  onSubmit(){
    
    this.isFormInvalid =  this.form.status == "INVALID";
    if(!this.isFormInvalid){
      console.log("Output form :- ", this.form.value);
      this.activeModal.close(this.form.value);
    }
    
  }


}
