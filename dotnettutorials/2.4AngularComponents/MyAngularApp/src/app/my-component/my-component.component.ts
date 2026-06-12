import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.sass']
})
export class MyComponentComponent implements OnInit {

  MyVariable = "Welcome to Angular Tutorials";

  constructor() { }

  ngOnInit(): void {
  }

}
