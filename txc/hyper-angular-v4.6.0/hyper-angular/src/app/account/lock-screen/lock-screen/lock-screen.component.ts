import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss']
})
export class LockScreenComponent implements OnInit {

  lockScreenForm!: FormGroup;
  formSubmitted: boolean = false;

  today: number = Date.now();

  constructor (private fb: FormBuilder) { }

  ngOnInit(): void {
    this.lockScreenForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngAfterViewInit(): void {
    document.body.classList.add('authentication-bg');
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.lockScreenForm.controls;
  }



  /**
   * On submit form
   */
  onSubmit(): void {
    this.formSubmitted = true;
  }


}
