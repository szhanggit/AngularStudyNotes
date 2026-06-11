import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../services/vendor.service';
import { FormBuilder, FormControl, FormGroup,Validators } from "@angular/forms";
import { Vendor } from '../../models/vendor.model';
@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit {
  form: FormGroup;
  isFormInvalid : boolean= false;
  vendor: Vendor;  
  
  constructor(private route:ActivatedRoute,
      private vendorSvc:VendorService,
      private router: Router,
      private formBuilder: FormBuilder) { }

    ngOnInit():void {    
    const vendorCode: string =this.route.snapshot.queryParamMap.get('vendorCode');
    const programCode: string =this.route.snapshot.queryParamMap.get('programCode');
    this.vendorSvc.getVendorById(programCode,vendorCode).subscribe(resp=>{
      this.vendor=resp;
      const invokeType = String( this.vendor.invokeType);
      this.form = this.formBuilder.group({ 
        vendorId:  new FormControl({value: this.vendor.id}),        
        status:new FormControl({value: this.vendor.status}),
        name:new FormControl({value: this.vendor.name},[Validators.required,Validators.minLength(2), Validators.maxLength(200)]),        
        invokeType: [invokeType, [Validators.required]],
        vendorCode : new FormControl({value: this.vendor.vendorCode},[Validators.required,Validators.minLength(2), Validators.maxLength(50)]),
        programCode :new FormControl({value:this.vendor.programCode},[Validators.required,Validators.minLength(2), Validators.maxLength(20)]),   
        callSetting :new FormControl({value:this.vendor.setting},[Validators.minLength(2), Validators.maxLength(500)]),        
        ModifiedBy:JSON.parse(sessionStorage.getItem('currentUser')!)   
      });
          
    })
  }

  onSave() : void{  
    this.isFormInvalid =  this.form.status == "INVALID";
    if(!this.isFormInvalid){
      this.vendorSvc.updateVendor(this.form.value).subscribe(res => {        
        if(res.success){          
        this.gotoList();  
        }
    });
  }
}

  gotoList() {    
    this.router.navigate(['system/vendor/list']);
  }
  get f(){
    return this.form.controls;
  }
}
