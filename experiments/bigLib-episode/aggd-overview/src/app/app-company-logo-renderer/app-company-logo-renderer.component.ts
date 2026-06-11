import { Component } from '@angular/core';
import { AgGridAngular, ICellRendererAngularComp } from "ag-grid-angular";
import {
  CellValueChangedEvent,
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  SelectionChangedEvent,
  ValueFormatterParams,
} from "ag-grid-community";

@Component({
  selector: 'app-app-company-logo-renderer',
  standalone: true,
  imports: [],
  templateUrl: './app-company-logo-renderer.component.html',
  styles: [
    "img {display: block; width: 25px; height: auto; max-height: 50%; margin-right: 12px; filter: brightness(1.1);} span {display: flex; height: 100%; width: 100%; align-items: center} p { text-overflow: ellipsis; overflow: hidden; white-space: nowrap }",
  ],
})
export class AppCompanyLogoRendererComponent implements ICellRendererAngularComp{
  // Init Cell Value
  public value!: string;
  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    return true;
  }
}
