import { Component, OnInit } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toggleex2',
  templateUrl: './toggleex2.component.html',
  styleUrls: ['./toggleex2.component.css']
})
export class Toggleex2Component implements OnInit {
  isCollapsed = false;
  constructor() { }

  ngOnInit(): void {
  }

  toggleItem(collapse: NgbCollapse): void{
    collapse.toggle();
  }
}
