import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantConfigService } from '../../services/tenant-config.service';
import { BaseResponse } from '../../models/base-response.model';
import { ClientHistoryList } from '../../models/client.model';
import { UtilityService } from '../../services/utility.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';


@Component({
  selector: 'app-client-history-list',
  templateUrl: './client-history-list.component.html',
  styleUrls: ['./client-history-list.component.scss']
})
export class ClientHistoryComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  clientHistoryList : ClientHistoryList[] = [];
  clientId: number=0; 
  tenant!:string; 
  selectedTenantUTC!: string;
  constructor(private readonly _client: ClientService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _tenantConfigService: TenantConfigService,
    private utilityService: UtilityService
    ) {
      this.selectedTenantUTC=utilityService.FetchLocalTimeFromUTC();
      const tenantFromRoute = this._route.snapshot.queryParamMap.get('tenantName');
      this.tenant = this._tenantConfigService.getTenant(tenantFromRoute).name;
 }

  ngOnInit(): void {
    this.getClientHistoryListData();
  }

// It is fetched the client history list by client id
  getClientHistoryListData(): void{
    const clientIdFromRoute = this._route.snapshot.params.id;
    this.clientId = clientIdFromRoute ? Number.parseInt(clientIdFromRoute) : 0; 

    this._client.getClientHistoryByClientId(this.clientId).subscribe((response:BaseResponse)=>{      
      if(response.success){ 
        if(JSON.parse(response.data).clientHistoryByClientId.length == 0)
        {
          return;
        }        
        let data = JSON.parse(response.data).clientHistoryByClientId;        
        if(data.length > 0){
          console.log(data);
          this.clientHistoryList = data;                      
        }
      }
    })
    
  }
//To navigate the client details page with client history details
  navigateToClientDetails(clientHistoryid:number,version:number):void{
this._router.navigate(['clients/details'],
      {
        queryParams: {
          tenantName: this.tenant,
          clientId: this.clientId,
          historyId:clientHistoryid,
          versionId:version
        }
      });
  }
}
