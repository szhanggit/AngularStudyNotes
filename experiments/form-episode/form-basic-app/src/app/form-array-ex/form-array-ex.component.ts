import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-array-ex',
  templateUrl: './form-array-ex.component.html',
  styleUrls: ['./form-array-ex.component.css']
})
export class FormArrayExComponent implements OnInit {
  formSubmitted: boolean = false;
  dataFormGroup: FormGroup;
  get f(): any {
    return this.dataFormGroup.controls;
  }

  constructor(private readonly _formBuilder: FormBuilder) { 
    this.dataFormGroup = this._formBuilder.group({
      firstNameCtrl: new FormControl({value: '', disabled: false}, [Validators.required, Validators.maxLength(5)]),//
      lastNameCtrl: new FormControl({value: '', disabled: false}, [Validators.required, Validators.maxLength(5)]),//
      merchantContactEmailList: this._formBuilder.array([this.createMerchantEmail()]),
      edenredContactEmailList: this._formBuilder.array([this.createInternalEmail()])
    });
  }

  ngOnInit(): void {
  }

  private createMerchantEmail(): FormGroup {
    return new FormGroup({
      'emailAddress': new FormControl({value: '', disabled: false}, [Validators.required, Validators.email]),
    });
  }

  private createInternalEmail(): FormGroup {
    return new FormGroup({
      'internalEmailAddress': new FormControl({value: '', disabled: false}, [Validators.email]),
    });
  }  

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  public addMerchantEmail() {
    const emails = this.dataFormGroup.get('merchantContactEmailList') as FormArray
    emails.push(this.createMerchantEmail())
  }

  public removeMerchantEmail(i: number) {
    const emails = this.dataFormGroup.get('merchantContactEmailList') as FormArray
    if (emails.length > 1) {
      emails.removeAt(i)
    } else {
      emails.reset()
    }
  }

  public addInternalEmail() {
    const emails = this.dataFormGroup.get('edenredContactEmailList') as FormArray
    emails.push(this.createInternalEmail())
  }

  public removeInternalEmail(i: number) {
    const emails = this.dataFormGroup.get('edenredContactEmailList') as FormArray
    if (emails.length > 1) {
      emails.removeAt(i)
    } else {
      emails.reset()
    }
  }

  OnSubmit(): void {
		this.formSubmitted = true;  //This is the triggering key.
		if (this.dataFormGroup.valid) {			
			this.formSubmitted = false;
			const body = { data: this.dataFormGroup.getRawValue() };
			console.log(body);
		}
		else
		{
			console.log("It is invalid.");
		}
	}
}
