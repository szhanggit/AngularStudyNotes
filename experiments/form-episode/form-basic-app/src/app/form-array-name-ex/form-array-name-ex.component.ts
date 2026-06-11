import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form-array-name-ex',
  templateUrl: './form-array-name-ex.component.html',
  styleUrls: ['./form-array-name-ex.component.css']
})
export class FormArrayNameExComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  form = new FormGroup({
    cities: new FormArray([new FormControl('SF'), new FormControl('NY')]),
  });

  get cities(): FormArray {
    return this.form.get('cities') as FormArray;
  }

  addCity() {
    this.cities.push(new FormControl());
  }

  onSubmit() {
    console.log(this.cities.value); // ['SF', 'NY']
    console.log(this.form.value); // { cities: ['SF', 'NY'] }
  }

  setPreset() {
    this.cities.patchValue(['LA', 'MTV']);
  }

}
