import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { CustomButtonComponent } from './custom-button/custom-button.component';

// Row Data Interface
interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AgGridAngular, CustomButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [CookieService]
})
export class AppComponent {
  title = 'cookieservice-app';
  themeClass = "ag-theme-quartz";
  // Row Data: The data to be displayed.
  rowData: IRow[] = [
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
  ];

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<IRow>[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
  ];

  defaultColDef: ColDef = {
    flex: 1,
  };

  constructor(private cookieService: CookieService){

  }

  ngOnInit(): void {

  }

  public columnDefs: ColDef[] = [
    {headerName: "Make & Model",  valueGetter: (p) => p.data.make + ' ' + p.data.model, flex: 1, filter: true, checkboxSelection: true },
    {field: "price", valueFormatter: p => '$' + p.value.toLocaleString(), flex: 1, filter: true, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: {
      values: [10, 50, 100],
  },},
    {
      field: "electric",
      headerName: "Actions",
      cellRenderer: CustomButtonComponent,
      flex: 2
    }
  ];


}
