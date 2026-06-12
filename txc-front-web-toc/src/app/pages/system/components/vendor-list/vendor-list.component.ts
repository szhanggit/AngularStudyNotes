import {AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { VendorService } from '../../services/vendor.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Vendor } from '../../models/vendor.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit, AfterViewInit{
  @ViewChild(NgbPagination) pagination!: NgbPagination;
   // list of vendors 
   vendorList: Vendor [];    
   total$: Observable<number>;
   total: number = 0;  
   pageSize : number = 20;
   pageIndex : number = 1;

  constructor(public vendorSvc:VendorService, private cdr: ChangeDetectorRef,
    private router: Router) { 
    this.total$ = vendorSvc.total$;
    this.total$.subscribe(total => this.total = total);
  }

 
  get itemStart() {
    return this.pageIndex === 1 ? 1 : this.total< 1 ? this.total : (((this.pageIndex - 1) * this.pageSize) + 1);
  }

  get itemEnd() {
    return this.pageIndex === this.pageCount || this.total < this.pageIndex * this.pageSize ? this.total : this.pageIndex * this.pageSize;
  }

  get pageCount() {
    return this.pagination?.pageCount;
  }
  ngOnInit(): void {
    this.searchData();    
   } 
   ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  searchData(){ 
    this.vendorSvc._getVendor(this.pageIndex-1, this.pageSize).subscribe(res => {           
        this.vendorList = JSON.parse(res.data).vendors.items;    
        this.total=JSON.parse(res.data).vendors.totalCount; 
        })       
  }
  pageChange(){
    this.searchData();
  }
   
  
  editVendor(item:any){   
    this.router.navigate(['system/vendor/edit-vendor/'],
      {queryParams:{'vendorCode':item.vendorCode,'programCode':item.programCode}});      
  }
}
