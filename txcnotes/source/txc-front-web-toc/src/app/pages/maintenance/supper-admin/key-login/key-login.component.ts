import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgProgressComponent } from 'ngx-progressbar';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { KeyValidateRequest } from 'src/app/core/models/key/key-validate-request.model';
import { KeyValidateResponse } from 'src/app/core/models/key/key-validate-response.model';
import { KeyValidateService } from 'src/app/core/service/key/key-validate.service';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-key-login',
  templateUrl: './key-login.component.html',
  styleUrls: ['./key-login.component.scss']
})
export class KeyLoginComponent implements OnInit {

  formGroup : FormGroup;
  modelRequest : KeyValidateRequest;
  pageTitle: BreadcrumbItem[] = [];
  title = 'Validate Key';

  @ViewChild(NgProgressComponent) progressBar: NgProgressComponent;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  constructor(
    private readonly router: Router
    ,private readonly keyService : KeyValidateService) { }

  ngOnInit(): void {
    this.modelRequest = new KeyValidateRequest();
  }

  ngAfterContentInit(): void {
    this.initializeFormGroup();
  }

  private initializeFormGroup(){
    this.formGroup = new FormGroup({
      keyName: new FormControl('',[Validators.required]),
      keyValue: new FormControl('',[Validators.required]),
    });
  }

  get f(){
    return this.formGroup.controls;
  }

  onSubmit(form: NgForm){

    if (form.invalid) {
        this.toast.showDanger("Please fill out the information correctly!");
      return;
    }

    this.progressBar.start();
    this.modelRequest.keyName = form.value["keyName"];
    this.modelRequest.keyValue = form.value["keyValue"];

    this.keyService.validateKey(this.modelRequest)
    .subscribe({
      next: response => {
          if(response.success){
            let data = response.data as KeyValidateResponse;
            this.toast.showSuccess(response.message);
            if(data === null || data === undefined){
              form.resetForm();
            }else{
              if(data.token){
                localStorage.setItem('sak',data.token);
                this.router.navigate(["super-admin-creation"]);
              }
              else{
                this.toast.showDanger("Token not validated, Please try again");
                form.resetForm();
              }
            }
          }else{
            this.toast.showDanger(response.message);
          }
      },
      error: e => {
        if((e.error) && (e.error.errors)){
          let errors = e.error.errors;
          let keys = Object.keys(errors);
          keys.forEach(key => {
            this.toast.showDanger(errors[key][0]);
          });
        }
        this.progressBar.complete()
      },
      complete : () => {this.progressBar.complete()}
    });


  }

}
