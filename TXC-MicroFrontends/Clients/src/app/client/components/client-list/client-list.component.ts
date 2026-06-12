import { ClientList, DictionaryDropdownModel } from './../../models/client.model';
import { ClientService } from '../../services/client.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientPermissionService } from '../../services/client-permission.service';
import { TenantConfigService } from '../../services/tenant-config.service';
import { BaseResponse } from '../../models/base-response.model';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  enumKeys : any[]=[];
  pageSize : number = 20;
  pageIndex : number = 1;
  searchTerm : string = "";
  clientList : ClientList[] = [];
  totalCount : number = 0;
  tenant!: string;
  searchPlaceholderText : string = "Search";
  selectVoucherIssuer : number|null = null;
  voucherIssuerList: DictionaryDropdownModel[] = [];
  action : string;
  message : string;

  get itemStart() {
    return this.pageIndex === 1 ? 1 : this.totalCount < 1 ? this.totalCount : (((this.pageIndex - 1) * this.pageSize) + 1);
  }
  get itemEnd() {
    return this.pageIndex === this.pageCount || this.totalCount < this.pageIndex * this.pageSize ? this.totalCount : this.pageIndex * this.pageSize;
  }
  get pageCount() {
    if(this.totalCount == 0)
      return 0;
    return Math.ceil(this.totalCount / ( this.totalCount < this.pageSize ? this.totalCount : this.pageSize));
  }

  constructor(private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private clientService : ClientService,
    public _clientPermissionService : ClientPermissionService,
    private readonly _tenantConfigService: TenantConfigService
    ) {
      const tenantFromRoute = this._route.snapshot.queryParamMap.get('tenantName');
      this.tenant = this._tenantConfigService.getTenant(tenantFromRoute).name;

      if(this.tenant == "TW")
      {
        this.searchPlaceholderText = "Search Client Name or Tax ID or Identity Code";
      }
      else
      {
        this.searchPlaceholderText = "Search Client Name or Identity Code";
      }

      this.action = history.state?.action;
      this.message = history.state?.message;
  }

  ngOnInit(): void {
    this.getData();
    if(this.tenant == "GL")
    {
      this.clientService.getDictionaryForDropdown("VoucherIssuer")
      .subscribe((response:BaseResponse)=>{
        if(response.success){
          this.voucherIssuerList = JSON.parse(response.data).dictionaries;
        }
      });
    }
  }

  ngAfterViewInit() {
    if(this.action == "clientCreated"){
      this.toast?.showSuccess(this.message)
    }
  }

  navigateToCreateClient() {
    this._router.navigate(['clients/create']);
  }

  navigateToClientDetails(clientId : number,clientCode:string):void {
    this._router.navigate(['clients/details'],
      {
        queryParams: {
          clientId: clientId,
          identityCode: clientCode
        }
      });
  }

  getData(){
    this.clientService.getAll(this.itemStart-1, this.pageSize, this.searchTerm, this.selectVoucherIssuer)
    .subscribe((response:BaseResponse)=>{
      if(response.success){      
        this.clientList = JSON.parse(response.data).client.items;
        this.totalCount = JSON.parse(response.data).client.totalCount;
      }
    });
  }

  pageSizeChanged() : void {
    this.pageIndex = 1;
    this.getData() 
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

  setClientStatus(data: ClientList) {
    data.status = data.status === 0? 1:0;

    let body = [
      {       
         op: "add",   
         path: "/status",       
         value : data.status
      }
  ]

    this.clientService.patch(data.id, body).subscribe((res : any) => {
      if (res.success) {
        this.toast?.showSuccess(`Status for ${res.patched.clientName} was successfully updated to ${res.patched.status ? 'active' : 'inactive'}.`);
      } else {
        this.toast?.showDanger(`There was a problem updating status of product ${res.data.patched.clientName}.`);
        data.status = data.status === 0? 1:0;
      }
    },
    (err : HttpErrorResponse)=>{
        this.toast?.showDanger(err.error.Message);
        data.status = data.status === 0? 1:0;
    });
  }
}
