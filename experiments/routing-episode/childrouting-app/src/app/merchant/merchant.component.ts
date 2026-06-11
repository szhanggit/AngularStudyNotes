import { Component, OnInit } from '@angular/core';
//import { ActivatedRoute, Router} from '@angular/router'

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styles: ['button {top: 50%; text-align: center;border-radius: 15px; border: 2px solid #73AD21; width: fit-content; margin: 20px; padding: 20px;}']
})
export class MerchantComponent implements OnInit {

  constructor(//private route: ActivatedRoute, private router: Router
    ) { }

  ngOnInit(): void {
  }

  /*createmerchants(){
    this.router.navigate(['createmerchants'], {relativeTo:this.route});
  }
  
  shop(){
    this.router.navigate(['shop'], {relativeTo:this.route});
  }

  dobatchtransaction(){
    this.router.navigate(['dobatchtransaction'], {relativeTo:this.route});
  }
  
  <button (click)='createmerchants()'>Create Merchants</button>
  <button (click)='shop()'>Shop</button>
  <button (click)='dobatchtransaction()'>Do Batch Transaction</button>  
  
  */  
}
