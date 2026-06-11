import { AgGridAngular } from "ag-grid-angular";
import { ColDef, GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AgGridColFitToSizeService } from "./ag-grid-col-fit-to-size.service";

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
  imports: [AgGridAngular, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: []
})
export class AppComponent {
  gridApi: GridApi = {} as GridApi;
  themeClass = "ag-theme-quartz";
  // Row Data: The data to be displayed.
  rowData: IRow[] = [];
  adminMgmtGridOptions: GridOptions = {} as GridOptions;

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    { field: "mission" },
    { field: "company" },
    { field: "location" },
    { field: "date" },
    { field: "price" },
    { field: "successful" },
    { field: "rocket" },
  ];

  @HostListener('window:resize',['$event'])
  //@ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  onResize(event:any)
  {
    this.agGridColFitToSizeSvc.broadcast();
    console.log('Window Resized!');
  }

  // Load data into grid when ready
  constructor(private http: HttpClient, private readonly agGridColFitToSizeSvc: AgGridColFitToSizeService) {
    this.adminMgmtGridOptions = <GridOptions>{
      columnDefs: this.colDefs,
      rowData: this.rowData,
      pagination: false,
      paginationPageSize: 20,
      suppressPaginationPanel: true,
      defaultColDef: {
        minWidth: 100,

        comparator: (valueA, valueB) => {
          return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        }
      }
    };
  }
  
  onGridReady(params: GridReadyEvent) {
    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/space-mission-data.json")
      .subscribe((data) => (this.rowData = data));
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();
      this.agGridColFitToSizeSvc.gridApi = params.api;
  }  

}

