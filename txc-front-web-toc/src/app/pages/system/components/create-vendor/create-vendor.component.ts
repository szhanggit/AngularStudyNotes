import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from "@angular/forms";
import { VendorService } from '../../services/vendor.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-vendor',
  templateUrl: './create-vendor.component.html',
  styleUrls: ['./create-vendor.component.scss']
})
export class CreateVendorComponent implements OnInit {
 form: FormGroup; 
  isFormInvalid : boolean= false;
 constructor(public formBuilder: FormBuilder,
  private vendorService:VendorService,
  private router: Router  ) {
}


ngOnInit(): void {
  this.form = this.formBuilder.group({
    status:[1, [Validators.required]],
    name: ['', [Validators.required,Validators.minLength(2), Validators.maxLength(100)]],
    invokeType: ["1", [Validators.required]],
    vendorCode : ['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
    programCode : ['',[Validators.required,Validators.minLength(2), Validators.maxLength(20)]],
    callSetting:[''],
    CreatedBy:JSON.parse(sessionStorage.getItem('currentUser')!)     
  });
}

resetForm(){
  this.form.controls.name.reset("");
  this.form.controls.vendorCode.reset("");
  this.form.controls.programCode.reset(""); 
  this.form.controls.callSetting.reset("");  
  invokeType: ["1", [Validators.required]];
}
onSubmit() : void{  
  this.isFormInvalid =  this.form.status == "INVALID";
  if(!this.isFormInvalid){   
   this.vendorService.createVendor(this.form.value).subscribe(res => {  
    if(res.message=='Success')     
    this.gotoList();  
  });
  }
}

gotoList() {
  this.resetForm();
  this.router.navigate(['system/vendor/list']);
}
get f(){
  return this.form.controls;
}
}
