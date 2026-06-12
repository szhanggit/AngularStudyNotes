import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg-controller',
  templateUrl: './svg-controller.component.html',
  styleUrls: ['./svg-controller.component.scss']
})
export class SvgControllerComponent {
  @Input() svgName: string = '';
  
  constructor() {
  }
}
