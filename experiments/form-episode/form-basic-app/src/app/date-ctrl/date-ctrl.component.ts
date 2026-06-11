import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-ctrl',
  templateUrl: './date-ctrl.component.html',
  styleUrls: ['./date-ctrl.component.css']
})
export class DateCtrlComponent implements OnInit {
  formSubmitted: boolean = false;
  dataFormGroup: FormGroup;
  Obj: JSON = JSON;

  constructor(private fb: FormBuilder) { 
    this.dataFormGroup = this.fb.group({
      singleDateCtrl: new FormControl({value :null, disabled: false}, [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  get date() {
    return this.dataFormGroup.get('date');
  }

  get f(): any {
    return this.dataFormGroup.controls;
  }

	toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
		if (tooltip.isOpen()) {
		  tooltip.close();
		} else {
		  tooltip.open({ formControl });
		}
	}

  onSubmit() {
    this.formSubmitted = true;
    if (this.dataFormGroup.valid) {
      this.formSubmitted = false;
      console.log('Form Submitted!', this.dataFormGroup.value);
    }
  }

}
