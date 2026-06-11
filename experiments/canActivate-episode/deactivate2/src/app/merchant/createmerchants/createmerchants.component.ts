import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-createmerchants',
  templateUrl: './createmerchants.component.html',
  styleUrls: ['./createmerchants.component.css']
})
export class CreatemerchantsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  editing: boolean = true;
}
