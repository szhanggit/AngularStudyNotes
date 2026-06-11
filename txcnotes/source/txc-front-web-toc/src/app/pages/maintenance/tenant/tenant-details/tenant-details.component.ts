import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgProgressComponent } from 'ngx-progressbar';

import { RefCountryModel } from 'src/app/core/models/tenant/ref-country-model';
import { TenantModel } from 'src/app/core/models/tenant/tenant-model';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

import { FileToBase64Service } from 'src/app/core/service/attachments/file-to-base64.service';
import { TenantListService } from 'src/app/core/service/tenant/tenant/tenant-list.service';
import { TenantReferencesService } from 'src/app/core/service/tenant/tenant/tenant-references.service';
import { TenantService } from 'src/app/core/service/tenant/tenant/tenant.service';


import { FutureDateValidator } from 'src/app/core/validators/future-date-validator';
import { AlreadyExistValidator } from 'src/app/core/validators/already-exist-validator';
import { CONSTANTS } from 'src/app/core/constants/constants';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/service/security/auth.service';
import { UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';

@Component({
  selector: 'app-tenant-details',
  templateUrl: './tenant-details.component.html',
  styleUrls: ['./tenant-details.component.scss']
})
export class TenantDetailsComponent implements OnInit {
  @ViewChild(NgProgressComponent) progressBar: NgProgressComponent;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  pageTitle: BreadcrumbItem[] = [];

  tenantNames: string[] = [];
  logo: string = "";
  domLoaded: boolean = false;
  currentDate = new Date(Date.now());
  nextDate = new Date(Date.now() + 1);

  imgSource: string = "";
  files: File[] = [];
  references: TenantReferencesService;
  companyTaxType: boolean = true;
  model: TenantModel;
  logoBase64: string = "";
  editMode = false;

  detailsFormGroup: FormGroup;
  enabledUpdate : boolean = false;

  get f() {
    return this.detailsFormGroup.controls;
  }

  get title() {
    return this.editMode ? 'Edit Tenant Information' : 'Add Tenant Information';
  }

  userClaim = new UserAuthClaim();

  constructor(
    private readonly _fileToBase64Svc: FileToBase64Service,
    private readonly _tenantSvc: TenantService,
    private readonly _tenantListSvc: TenantListService,
    private readonly _tenantReferencesSvc: TenantReferencesService,
    private readonly _formBuilder: FormBuilder,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly authSvc: AuthService) {
    this.references = _tenantReferencesSvc;
  }

  ngAfterContentInit(): void {
    this.domLoaded = true;
  }

  ngOnInit(): void {

    this.authSvc.userAuthClaim.subscribe(data =>
      {
        if(data == null || data == undefined){
          this._router.navigate(['account/401']);
        }
        this.userClaim = data;
        this.checkAllowedOperation();
      });

    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this._tenantReferencesSvc.initializeReferences();

    this._activatedRoute.params.subscribe(params => {
      this.editMode = !!params.id;

      this.detailsFormGroup = this._formBuilder.group({
        tenantBasicInfoId: new FormControl({ value: '' }),
        name: new FormControl({ value: '', disabled: this.editMode }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
        countryCode: new FormControl({ value: '', disabled: this.editMode }, [Validators.required, Validators.minLength(2), Validators.maxLength(5)]),
        timezone: new FormControl({ value: '', disabled: this.editMode }, [Validators.required, Validators.maxLength(100)]),
        timeFormat: new FormControl({ value: '', disabled: this.editMode }, [Validators.required, Validators.maxLength(20)]),
        currencySymbol: new FormControl({ value: '', disabled: this.editMode }, [Validators.required, Validators.maxLength(5)]),
        companyTaxType: new FormControl({ value: true, disabled: false }, [Validators.required]),
        companyTaxRate: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.min(1)]),
        effectivityDate: new FormControl({ value: formatDate(this.currentDate, CONSTANTS.DATE_FORMAT, CONSTANTS.DEFAULT_LOCALE), disabled: this.editMode }, [Validators.required, FutureDateValidator.futureDateValidator]),
        language: new FormControl({ value: '', disabled: false }, [Validators.required]),
        logo: new FormControl({ value: '', disabled: false })
      });

      if (!this.editMode) {
        this._tenantListSvc.getList((tenants: TenantModel[]) => {
          this.tenantNames = tenants.map(a => a.name.toLowerCase().trim());
          this.f.name.setValidators([AlreadyExistValidator.isAlreadyExists(this.tenantNames), Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
        });
      } else {
        this._tenantSvc.getTenantById(params.id).subscribe((result: TenantModel) => {
          result.effectivityDate = formatDate(result.effectivityDate, CONSTANTS.DATE_FORMAT, CONSTANTS.DEFAULT_LOCALE);
          this.logo = result.logo;
          result.logo = '';
          this.detailsFormGroup.setValue(result);
        });
      }
    });
  }

  onChangeCompanyTaxRate() {
    if (this.editMode) {
      this.detailsFormGroup.get("effectivityDate")?.enable();
    }
  }

  OnCountryCodeChanged(): void {
    const countryCode = this.f.countryCode.value;
    this.f.currencySymbol.setValue(this.references.countries
      .find((x: RefCountryModel) => x.countryCode === countryCode).currencySymbol);
  }

  private _formIsInvalid() {
    if (!this.detailsFormGroup.valid) {
      return true;
    }
    return false;
  }

  onFileChange(fileInput: any): void {
    if ((fileInput.target.files) && (fileInput.target.files[0])) {
      this._fileToBase64Svc.converToBase64(fileInput.target.files[0] as File, (d: string) => {
        this.logo = d;
        this.f.logo.setValue(d);
        this.detailsFormGroup.markAsDirty();
      });
    }
  }

  OnSubmit(): void {
    if (this._formIsInvalid()) {
      return;
    }

    const formValues: TenantModel = { ...this.detailsFormGroup.getRawValue() };
    formValues.effectivityDate = new Date(this.f.effectivityDate.value).toISOString();

    this.progressBar.start();
    if (!this.editMode) {
      this._tenantSvc.addTenant(formValues,
        (result: boolean) => {
          if (result) {
            this.progressBar.complete();
            this.resetForm();
            this._router.navigateByUrl('/maintenance/tenant-management', { state: { showTenantAdded: true, tenantName:  formValues.name } });
          } else {
            this.progressBar.complete();
            this.toast.showDanger(`There is an error adding ${formValues.name}. Please check entered values.`);
          }
        });
    } else {
      formValues.logo = this.logo;
      this._tenantSvc.updateTenant(formValues,
        (result: boolean) => {
          if (result) {
            this.progressBar.complete();
            this.toast.showSuccess(`${formValues.name} successfully updated.`);
          } else {
            this.progressBar.complete();
            this.toast.showDanger(`There is an error updating ${formValues.name}. Please check entered values.`);
          }
        });
    }

  }

  resetForm(): void {
    this.detailsFormGroup.reset();
    this.f.name.setValue('');
    this.f.countryCode.setValue('');
    this.f.timezone.setValue('');
    this.f.timeFormat.setValue('');
    this.f.currencySymbol.setValue('');
    this.f.companyTaxType.setValue(true);
    this.f.companyTaxRate.setValue('');
    this.f.effectivityDate.setValue(formatDate(this.currentDate, CONSTANTS.DATE_FORMAT, CONSTANTS.DEFAULT_LOCALE));
    this.f.language.setValue('');
    this.f.logo.setValue('');
    this.logo = '';
  }
  checkAllowedOperation()
  {
    let updateTenantOpsId = parseInt(environment.upd_tenant_op_id);
    if(this.userClaim.operations.length)
    {
      this.enabledUpdate = this.userClaim.operations.some(e => e === updateTenantOpsId);
    }
  }
}
