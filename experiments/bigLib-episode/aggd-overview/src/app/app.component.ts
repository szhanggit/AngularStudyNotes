import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { RouterOutlet } from '@angular/router';

import { AgGridAngular, ICellRendererAngularComp } from "ag-grid-angular";
import {
  CellValueChangedEvent,
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  SelectionChangedEvent,
  ValueFormatterParams,
} from "ag-grid-community";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import "../../src/styles.css";
import { AppCompanyLogoRendererComponent } from "./app-company-logo-renderer/app-company-logo-renderer.component";
import { AppMissionResultRendererComponent } from "./app-mission-result-renderer/app-mission-result-renderer.component";

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
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AgGridAngular, HttpClientModule],
  templateUrl: './app.component.html',
  styles: [
    "img { width: auto; height: auto; } span {display: flex; height: 100%; justify-content: center; align-items: center} ",
  ],
  providers: []
})
export class AppComponent {
 
  
  themeClass = "ag-theme-quartz";

  // Return formatted date value
  dateFormatter(params: ValueFormatterParams) {
    return new Date(params.value).toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Row Data: The data to be displayed.
  rowData: IRow[] = [];

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    {
      field: "mission",
      width: 150,
      checkboxSelection: true,
    },
    {
      field: "company",
      width: 130,
      cellRenderer: AppCompanyLogoRendererComponent,
    },
    {
      field: "location",
      width: 225,
    },
    {
      field: "date",
      valueFormatter: this.dateFormatter,
    },
    {
      field: "price",
      width: 130,
      valueFormatter: (params) => {return "£" + params.value.toLocaleString();},
    },
    {
      field: "successful",
      width: 120,
      cellRenderer: AppMissionResultRendererComponent,
    },
    { field: "rocket" },
  ];

  // Default Column Definitions: Apply configuration across all columns
  defaultColDef: ColDef = {
    filter: true, // Enable filtering on all columns
    editable: true, // Enable editing on all columns
  };

  // Load data into grid when ready
  constructor(private http: HttpClient) {}
  onGridReady(params: GridReadyEvent) {
    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/space-mission-data.json")
      .subscribe((data) => (this.rowData = data));
  }

  // Handle row selection changed event
  onSelectionChanged = (event: SelectionChangedEvent) => {
    console.log("Row Selected!");
  };

  // Handle cell editing event
  onCellValueChanged = (event: CellValueChangedEvent) => {
    console.log(`New Cell Value: ${event.value}`);
  };




}

