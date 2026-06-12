import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgProgressComponent } from 'ngx-progressbar';
import { first } from 'rxjs/operators';
import { KeySaveRequest } from 'src/app/core/models/key/key-save-request.model';
import { KeyService } from 'src/app/core/service/key/key.service';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-key-save',
  templateUrl: './key-save.component.html',
  styleUrls: ['./key-save.component.scss']
})
export class KeySaveComponent implements OnInit {

  formGroup : FormGroup;
  modelRequest : KeySaveRequest;
  pageTitle: BreadcrumbItem[] = [];
  title = 'Save Key';

  
  @ViewChild(NgProgressComponent) progressBar: NgProgressComponent;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  constructor(private readonly keyService : KeyService) { }

  ngOnInit(): void {
    this.modelRequest = new KeySaveRequest();
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

  onSubmit(){
    if (this.formGroup.invalid) {
      this.toast.showDanger("please fill out the information correctly!");
    return;
  }
  this.progressBar.start();
  this.modelRequest.keyName = this.f.keyName.value;
  this.modelRequest.keyValue = this.f.keyValue.value;
  this.keyService.createKey(this.modelRequest)
  .pipe(first())
  .subscribe({
    next: data => {
        this.toast.showStandard(data.message);
        this.formGroup.reset();
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
