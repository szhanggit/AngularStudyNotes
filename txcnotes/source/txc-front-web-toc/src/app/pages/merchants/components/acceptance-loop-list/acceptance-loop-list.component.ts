import { Component,  OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { BaseResponse } from 'src/app/pages/products/models/base-response';
import { AcceptanceLoop } from '../../models/acceptance-loop.model';
import { AcceptanceLoopService } from '../../services/acceptance-loop.service';

@Component({
  selector: 'app-acceptance-loop-list',
  templateUrl: './acceptance-loop-list.component.html',
  styleUrls: ['./acceptance-loop-list.component.scss']
})
export class AcceptanceLoopListComponent implements OnInit {

  acceptanceLoopList : any;

  pageSize : number = 20;

  pageIndex : number = 1;

  searchTerm : string = "";

  get itemStart() {
    return this.pageIndex === 1 ? 1 : this.acceptanceLoopList.totalCount < 1 ? this.acceptanceLoopList.totalCount : (((this.pageIndex - 1) * this.pageSize) + 1);
  }

  get itemEnd() {
    return this.pageIndex === this.pageCount || this.acceptanceLoopList.totalCount < this.pageIndex * this.pageSize ? this.acceptanceLoopList.totalCount : this.pageIndex * this.pageSize;
  }

  get pageCount() {
    return this.acceptanceLoopList.totalCount / ( this.acceptanceLoopList.totalCount < this.pageSize ? this.acceptanceLoopList.totalCount : this.pageSize);
  }

  constructor(private router : Router,
    private route: ActivatedRoute,
    private _acceptanceLoopService : AcceptanceLoopService) { }

  ngOnInit(): void {
    this._acceptanceLoopService.clear();
  this.getData();  
  }

  getData(){
    this._acceptanceLoopService.getAll(this.pageIndex-1, this.pageSize, this.searchTerm).pipe(
      debounceTime(3000)
    ).subscribe((response:BaseResponse)=>{      
      if(response.success){
        this.acceptanceLoopList = JSON.parse(response.data).acceptanceLoops;
      }
    });
  }

  getAvailableShop(acceptanceLoopMerchants : any){
    if(acceptanceLoopMerchants.merchant[0].shop.length == acceptanceLoopMerchants.acceptanceLoopMerchantShops.length){
      return "All (" + acceptanceLoopMerchants.merchant[0].shop.length + " shops)"
    }
    else{
      return "Limited (" + acceptanceLoopMerchants.acceptanceLoopMerchantShops.length + " shops)"
    }
  }

  pageChange(){
    this.getData();
  }

  onSearchChange(){
    let wordSearch = this.searchTerm;
    setTimeout(() => {
        if (wordSearch == this.searchTerm) {
              this.getData();
        }
    }, 1000);    
  }

  edit(item : AcceptanceLoop){
    this._acceptanceLoopService.set(item);
    this.router.navigate(["../edit/"+ item.acceptanceLoopId], {relativeTo : this.route});
  }
  
}
