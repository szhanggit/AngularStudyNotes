import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lock-screen2',
  templateUrl: './lock-screen2.component.html',
  styleUrls: ['./lock-screen2.component.scss']
})
export class LockScreen2Component implements OnInit {

  lockScreenForm2!: FormGroup;
  formSubmitted: boolean = false;


  constructor (private fb: FormBuilder) { }

  ngOnInit(): void {
    this.lockScreenForm2 = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.lockScreenForm2.controls;
  }


  /**
   * On submit form
   */
  onSubmit(): void {
    this.formSubmitted = true;
  }

}
