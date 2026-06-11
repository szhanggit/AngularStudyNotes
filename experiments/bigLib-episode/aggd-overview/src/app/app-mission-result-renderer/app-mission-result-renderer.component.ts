import { AgGridAngular, ICellRendererAngularComp } from "ag-grid-angular";
import {
  CellValueChangedEvent,
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  SelectionChangedEvent,
  ValueFormatterParams,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";

// Row Data Interface
interface IRow {
  mission: string;
  company: string;
  location: string;
  date: string;
  time: string;
  rocket: string;
  price: number;
  successful: boolean;
}

@Component({
  selector: 'app-app-mission-result-renderer',
  standalone: true,
  imports: [],
  templateUrl: './app-mission-result-renderer.component.html',
  styles: [
    "img { width: auto; height: auto; } span {display: flex; height: 100%; justify-content: center; align-items: center} ",
  ],
})
export class AppMissionResultRendererComponent implements ICellRendererAngularComp{
  // Init Cell Value
  public value!: string;
  agInit(params: ICellRendererParams): void {
    this.value = params.value ? "tick-in-circle" : "cross-in-circle";
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    return true;
  }
}
