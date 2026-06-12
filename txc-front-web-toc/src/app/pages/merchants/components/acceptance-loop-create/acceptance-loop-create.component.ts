import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcceptanceLoop } from '../../models/acceptance-loop.model';
import { AcceptanceLoopService } from '../../services/acceptance-loop.service';
import { AcceptanceLoopRequest } from '../../models/acceptance-loop-request.model';
import { AcceptanceLoopDetails } from '../../models/acceptance-loop-details.model';
import { BaseResponse } from 'src/app/pages/products/models/base-response';

@Component({
  selector: 'app-acceptance-loop-create',
  templateUrl: './acceptance-loop-create.component.html',
  styleUrls: ['./acceptance-loop-create.component.scss']
})
export class AcceptanceLoopCreateComponent implements OnInit {

  form: FormGroup;

  isFormInvalid : boolean= true;

  isEdit : boolean = false;

  acceptanceLoop : AcceptanceLoop;
  
  constructor(private location: Location,
    public formBuilder: FormBuilder,
    private router : Router,
    private route: ActivatedRoute,
    private acceptanceLoopService : AcceptanceLoopService) { }

  ngOnInit(): void {
    console.log("this.route",this.route);
    this.isEdit = this.route.snapshot.url[1].path == "edit" ? true : false;
    this.acceptanceLoop = this.acceptanceLoopService.get();
    console.log("this.acceptanceLoop", this.acceptanceLoop);
    this.form = this.formBuilder.group({
      name: [ this.acceptanceLoop === null ? "" : this.acceptanceLoop.code, [Validators.required]],
      description: [ this.acceptanceLoop === null ? "" : this.acceptanceLoop.description]
    });
    this.isFormInvalid =  this.form == undefined || this.form.status == "INVALID";
  }

  goBackToPrevPage(): void {
    this.location.back();
  }

  showMerchantList():boolean{
    console.log("showMerchantList()", this.acceptanceLoop === null ? false : (this.acceptanceLoop.acceptanceLoopMerchants === null ? false : this.acceptanceLoop.acceptanceLoopMerchants.length > 0))
    return this.acceptanceLoop === null ? false : (this.acceptanceLoop.acceptanceLoopMerchants === null ? false : this.acceptanceLoop.acceptanceLoopMerchants.length > 0);
  }

  onSubmit() : void{
    this.isFormInvalid =  this.form == undefined || this.form.status == "INVALID";
    if(!this.isFormInvalid){
      let data : AcceptanceLoop = {
        acceptanceLoopId  : 0,
        code : this.form.value.name,
        description : this.form.value.description,
        createdBy : "1",
        createdOn : "",
        status : true,
        acceptanceLoopMerchants : this.acceptanceLoop != null ? this.acceptanceLoop.acceptanceLoopMerchants : null,
      }
      this.acceptanceLoopService.set(data);
    }
  }

  onSelectMerchantClick() : void{
    this.onSubmit();
    if(!this.isFormInvalid){
      if(this.isEdit){
        this.router.navigate(["../../select-merchant"], {relativeTo : this.route});
      }
      else{
      this.router.navigate(["../select-merchant"], {relativeTo : this.route});
      }
    }
  }

  getAvailableShop(item : any){
    console.log("acceptanceLoopMerchants", item);
    if(item.merchant[0].shop.length === item.acceptanceLoopMerchantShops.length){
      return "All (" + item.merchant[0].shop.length + " shops)"
    }
    else{
      return "Limited (" + item.acceptanceLoopMerchantShops.length + " shops)"
    }
  }

  onDeleteMerchant(index : number) : void {
    this.acceptanceLoop.acceptanceLoopMerchants.splice(index, 1);
  }

  onEditMerchant(index : number) : void {
    if(this.isEdit){
      this.router.navigate(["../../select-merchant"], { queryParams : {index : index}, relativeTo : this.route});
    }
    else{
    this.router.navigate(["../select-merchant"], { queryParams : {index : index}, relativeTo : this.route});
    }
  }

  onConfirm(){
    this.onSubmit();
    if(!this.isFormInvalid){
      this.acceptanceLoop = this.acceptanceLoopService.get();
      let data : AcceptanceLoopRequest ={
        acceptanceLoopId  : 0,
        code : this.acceptanceLoop.code,
        description : this.acceptanceLoop.description,
        createdBy : "1",
        createdOn : "",
        status : true,
        isDefault : false,
        lastModifiedBy : "1",
        lastModifiedOn : "",
        acceptanceLoopDetails : []
      }

      for(let i=0; i < this.acceptanceLoop.acceptanceLoopMerchants.length; i++){
        for (let j = 0; j < this.acceptanceLoop.acceptanceLoopMerchants[i].acceptanceLoopMerchantShops.length; j++) {
          let element : AcceptanceLoopDetails = {
            acceptanceLoopDetailId: 0,
            acceptanceLoopId: 0,
            merchantId: this.acceptanceLoop.acceptanceLoopMerchants[i].merchant[0].merchantId,
            shopId: this.acceptanceLoop.acceptanceLoopMerchants[i].acceptanceLoopMerchantShops[j].shop[0].shopId,
            status: true,
            createdBy: "string",
            createdOn: "2022-10-13T00:59:04.480Z",
            lastModifiedBy: "string",
            lastModifiedOn: "2022-10-13T00:59:04.480Z",
            action : this.isEdit ? 2 : 1,
          }
          data.acceptanceLoopDetails.push(element);
        }
      }

      if(this.isEdit){
        this.acceptanceLoopService.edit(data).subscribe((response:BaseResponse)=>{      
          if(response.success){
            this.goBackToPrevPage();
          }
        });
      }
      else{
        this.acceptanceLoopService.create(data).subscribe((response:BaseResponse)=>{      
          if(response.success){
            this.goBackToPrevPage();
          }
        });
      }
    }
  }
}
