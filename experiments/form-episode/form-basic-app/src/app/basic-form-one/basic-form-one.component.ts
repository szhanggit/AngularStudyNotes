import { formatDate } from '@angular/common';
import { Component, OnInit, inject, LOCALE_ID, Inject } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, RequiredValidator, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PRODUCT_CONSTANTS } from '../model/form-constants.model';
import { CONSTANTS } from '../model/constants';

@Component({
  selector: 'app-basic-form-one',
  templateUrl: './basic-form-one.component.html',
  styleUrls: ['./basic-form-one.component.css']
})
export class BasicFormOneComponent implements OnInit {
  model: NgbDateStruct | null;
  firstName: string;
  lastName: string;
  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
  time = { hour: 0, minute: 0 };
  meridian = true;
  rating = 8;
  dataFormGroup: FormGroup;
  formError: any;
  productTypes = PRODUCT_CONSTANTS.PRODUCT_TYPE;
  Obj: JSON = JSON;
  formErrors: string[];
  currentDate = new Date(Date.now());
  nextDate: Date = new Date();

  nameValidators: ValidatorFn[] = [Validators.required, Validators.maxLength(5)]   
  ratingCtrlValidators: ValidatorFn[] = [Validators.required, Validators.min(5), Validators.max(10)];
  msgBoxValidators: ValidatorFn[] = [Validators.required, Validators.maxLength(10)];
  requiredValidator: ValidatorFn[] = [Validators.required];
  // form
  get f(): any {
    return this.dataFormGroup.controls;
  }

  constructor(private readonly _formBuilder: FormBuilder, @Inject(LOCALE_ID) private locale: string) { 
    /*this.model = {"year": 0,
                  "month": 0,
                  "day": 0};*/
	this.model = null;
	this.firstName = "";
	this.lastName = "";
	this.formErrors = [];
	this.nextDate.setDate(this.currentDate.getDate() + 90);
	this.dataFormGroup = this._formBuilder.group({
		firstNameCtrl: new FormControl({value: '', disabled: false}, this.nameValidators),//
		lastNameCtrl: new FormControl({value: '', disabled: false}, this.nameValidators),//
		frontTechCtrl: new FormControl({ value: '', disabled: false }),//
		msgBoxCtrl: new FormControl({value: '', disabled: false}, this.msgBoxValidators),//
		vehicle1Ctrl: new FormControl({ value: false, disabled: false }), 
		vehicle2Ctrl: new FormControl({ value: false, disabled: false }),
		vehicle3Ctrl: new FormControl({ value: false, disabled: false }),
		status: new FormControl({ value: 0, disabled: false }),
		productTypeCtrl: new FormControl({ value: null, disabled: false }, [Validators.required]),//
		ratingCtrl: new FormControl({value :null, disabled: false}, this.ratingCtrlValidators),//
		singleDateCtrl: new FormControl({value :formatDate(this.currentDate, CONSTANTS.DATE_FORMAT, this.locale), disabled: false}, [Validators.required]),//
		startDateCtrl: new FormControl({value :formatDate(this.currentDate, CONSTANTS.DATE_FORMAT, CONSTANTS.DEFAULT_LOCALE), disabled: false}),//, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
		toDateCtrl: new FormControl({value :formatDate(this.nextDate, CONSTANTS.DATE_FORMAT, CONSTANTS.DEFAULT_LOCALE), disabled: false}),//, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
	});
	
	this.f.vehicle2Ctrl.setValue(true);
	this.f.frontTechCtrl.setValidators(this.requiredValidator);
	this.f.firstNameCtrl.valueChanges.subscribe((value: string) => {

	});

	console.log(`locale: ${formatDate(this.currentDate, CONSTANTS.DATE_FORMAT, this.locale)}
				DEFAULT_LOCALE: ${formatDate(this.currentDate, CONSTANTS.DATE_FORMAT, CONSTANTS.DEFAULT_LOCALE)}
				next date: ${formatDate(this.nextDate, CONSTANTS.DATE_FORMAT, CONSTANTS.DEFAULT_LOCALE)}`);
  }

  ngOnInit(): void {
  }

  enableRatingCtrl(){
	this.dataFormGroup.get('ratingCtrl')?.enable();
  }

  disableRatingCtrl(){
	this.dataFormGroup.get('ratingCtrl')?.disable();
  }

  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

	toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
		if (tooltip.isOpen()) {
		  tooltip.close();
		} else {
		  tooltip.open({ formControl });
		}
	}

	formSubmitted: boolean = false;

	OnSubmit(): void {
		//console.log(`this.dataFormGroup.valid: ${this.dataFormGroup.valid} | f.rating?.invalid ${this.f.ratingCtrl?.invalid}`);
		this.formSubmitted = true;  //This is the triggering key.
		this.formErrors = [];
		if (this.dataFormGroup.valid) {			
			this.formSubmitted = false;
			const body = { data: this.dataFormGroup.getRawValue() };
			body.data.startDateCtrl = this.fromDate;
			body.data.toDateCtrl = this.toDate;
			console.log(body);
			this.dataFormGroup.reset();
		  //this._merchantService.createMerchant(body).subscribe(res => {
			//this.backToList('add');
		  //});
		}
		else
		{
			console.log("It is invalid.");
		}
	}

	setErrorOnFirstName(){
		this.f.firstNameCtrl.setErrors({"required":true});
	}

	setCustomError() {
		this.dataFormGroup.setErrors({ customError: 'Custom error message' });
		this.formError = this.dataFormGroup.errors;
		console.log(JSON.stringify(this.dataFormGroup.errors));
	}

	clearCustomError() {
		this.dataFormGroup.setErrors(null);
	}

	collectFormErrors() {
		/*if (this.dataFormGroup.errors) {
		  if (this.dataFormGroup.errors) {
			this.formErrors.push('Rating is required.');
		  }
		  if (this.dataFormGroup.errors.min) {
			this.formErrors.push('Rating must be at least 1.');
		  }
		  if (this.dataFormGroup.errors.customError) {
			this.formErrors.push(this.rating.errors.customError);
		  }
		}*/
	}

	/*getFormValidationMessages() : string[] {
        let messages: string[] = [];
        Object.values(this.controls).forEach(c => 
            messages.push(...(c as ProductFormControl).getValidationMessages()));
        return messages;
    }

    getValidationMessages() {
        let messages: string[] = [];
        if (this.errors) {
            for (let errorName in this.errors) {
                switch (errorName) {
                    case "required":
                        messages.push(`You must enter a ${this.label}`);
                        break;
                    case "minlength":
                        messages.push(`A ${this.label} must be at least ${this.errors['minlength'].requiredLength} characters`);
                        break;
                    case "maxlength":
                        messages.push(`A ${this.label} must be no more than ${this.errors['maxlength'].requiredLength} characters`);
                        break;
                    case "pattern":
                        messages.push(`The ${this.label} contains illegal characters`);
                        break;  
                    case "limit":
                        messages.push(`A ${this.label} cannot be more
                            than ${this.errors['limit'].limit}`);
                        break;                         
                }
            }
        }
        return messages;
    }*/	
}
