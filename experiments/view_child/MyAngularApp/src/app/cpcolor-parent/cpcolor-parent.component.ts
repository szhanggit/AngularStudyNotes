import { Component, OnInit, ViewChild } from '@angular/core';
import { CpcolorDirective } from '../cpcolor.directive';

@Component({
  selector: 'app-cpcolor-parent',
  templateUrl: './cpcolor-parent.component.html',
  styleUrls: ['./cpcolor-parent.component.sass']
})
export class CpcolorParentComponent implements OnInit {
  @ViewChild(CpcolorDirective)
  private cpColorDirective = {} as CpcolorDirective;
  changeColor(color: string) {
      //this.cpColorDirective.change(color);
  }

  constructor() { }

  ngOnInit(): void {
  }
}
