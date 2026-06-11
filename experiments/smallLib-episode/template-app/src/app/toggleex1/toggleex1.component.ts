import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toggleex1',
  templateUrl: './toggleex1.component.html',
  styleUrls: ['./toggleex1.component.css']
})
export class Toggleex1Component implements OnInit {
  isCollapsed = false;
  constructor() { }

  ngOnInit(): void {
  }

}
