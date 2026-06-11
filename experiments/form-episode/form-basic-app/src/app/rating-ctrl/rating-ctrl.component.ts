import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rating-ctrl',
  templateUrl: './rating-ctrl.component.html',
  styleUrls: ['./rating-ctrl.component.css']
})
export class RatingCtrlComponent implements OnInit {
  Obj: JSON = JSON;
  ratingForm: FormGroup;
  formSubmitted: boolean = false;

  constructor(private readonly fb: FormBuilder) { 
    this.ratingForm = this.fb.group({
      ratingCtrl: new FormControl({value: null, disabled: false}, [Validators.required, Validators.min(5)]),//
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.formSubmitted = true; 
    console.log(`this.ratingForm.valid: ${this.ratingForm.valid} | f.rating?.invalid ${this.f.ratingCtrl?.invalid}`);
    if (this.ratingForm.valid) {
      console.log('Form Submitted!', this.ratingForm.value);
      this.formSubmitted = false;
    } else {
      console.log('Form is invalid!');
    }
  }

  get f(): any {
    return this.ratingForm.controls;
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
		if (tooltip.isOpen()) {
		  tooltip.close();
		} else {
		  tooltip.open({ formControl });
		}
	}

}
