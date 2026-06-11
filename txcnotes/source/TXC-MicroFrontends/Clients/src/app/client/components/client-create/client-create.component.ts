import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { BaseResponse } from '../../models/base-response.model';
import { GLClientFormGroup, IndiaClientFormGroup, TaiwanClientFormGroup, GRClientFormGroup, SingaporeClientFormGroup  } from '../../models/client-form-group.model';
import { IDefineFormGroup } from '../../models/define-form-group.model';
import { ClientService } from '../../services/client.service';
import { TenantConfigService } from '../../services/tenant-config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.scss']
})
export class ClientCreateComponent implements OnInit {

  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  @ViewChild(ClientFormComponent) clientForm!: ClientFormComponent;
  
  tenant!: string;
  private readonly navCreateClient="clientCreated";
  private readonly MSG_SUCCESS="Client created successfully.";
  private readonly INACTIVE=0;
  formGroupDefinitions: IDefineFormGroup[] =[
    new TaiwanClientFormGroup(),
    new IndiaClientFormGroup(),
    new GLClientFormGroup(),
    new GRClientFormGroup(),
    new SingaporeClientFormGroup()
  ];
  clientFormGroup: FormGroup = new FormGroup({});

  constructor( private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private modalService: NgbModal,
    _formBuilder: FormBuilder,
    _tenantConfigService: TenantConfigService,
    private readonly clientService : ClientService) {
    const tenantFromRoute = this._route.snapshot.queryParamMap.get('tenantName');
    this.tenant = _tenantConfigService.getTenant(tenantFromRoute).name;

    let def = this.formGroupDefinitions.find(f=> f.tenantCode === this.tenant)
    if (def) {
      let newcontrolID=this.clientService.createGuid();
      this.clientFormGroup = def.define(_formBuilder, false,true,newcontrolID);
    }
  }

  ngOnInit(): void {
  }

  backToList(action?: string): void {
    if (action && action === this.navCreateClient) {
      this._router.navigate(['/clients'],
        {
          state : {
            action : this.navCreateClient,
            message : this.MSG_SUCCESS
          }
        }
      );
    } else {
      this._router.navigate(['/clients']);
    }
  }

  onCancel(modalCancelConfrimation : any):void{
    this.modalService.open(modalCancelConfrimation,  { backdrop : 'static',keyboard : false, ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.backToList();
      });
        
  }

 
  //Create Client API Invoke
  onSubmit():void{
    let clientCreateRequest =   this.clientService.SetClientRequestPayload( this.clientFormGroup,this.clientForm,this.INACTIVE);
      this.clientService.create(clientCreateRequest).subscribe((data : BaseResponse)=>{
        if(data.success){
          this.backToList(this.navCreateClient);
        }
      },
      (err : HttpErrorResponse)=>{
        if(err.error.data instanceof Array){
          for (let index = 0; index < err.error.data.length; index++) {
            this.toast?.showDanger(err.error.data[index]);          
          }
        }
        else{
          this.toast?.showDanger(err.error.message);
        }
      });
  }
}

