import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.css'
})
export class CustomButtonComponent implements ICellRendererAngularComp{
  agInit(params: ICellRendererParams): void {}
  refresh(params: ICellRendererParams) {
      return true;
  }
  buttonClicked() {
      alert('Software Launched');
  }
}
