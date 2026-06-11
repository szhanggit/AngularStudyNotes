import { Component, OnInit, ViewChild } from '@angular/core';
import { NgProgressComponent } from 'ngx-progressbar';
import { ToastrService } from 'ngx-toastr';
import { LdaUserModel } from 'src/app/core/models/security/lda-user-model';
import { CreateSuperAdminCommand } from 'src/app/core/models/super-admin-crud/request/create-super-admin-command.model';
import { LdapUserService } from 'src/app/core/service/security/ldap-user.service';
import { SuperAdminService } from 'src/app/core/service/super-admin-crud/super-admin.service';
import { ListOfUserRolesService } from 'src/app/core/service/user-role/list-of-user-roles.service';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';

@Component({
  selector: 'app-add-new-super-admin',
  templateUrl: './add-new-super-admin.component.html',
  styleUrls: ['./add-new-super-admin.component.scss']
})
export class AddNewSuperAdminComponent implements OnInit {

  @ViewChild(NgProgressComponent) progressBar!: NgProgressComponent;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  userFound: boolean = false;
  searching: boolean = false;
  search:string = "";
  ldapUser: LdaUserModel;

  constructor(private readonly ldapUserSvc: LdapUserService
    , private readonly superAdminSvc: SuperAdminService
    , private readonly listOfUserRolesSvc: ListOfUserRolesService) { }

  ngOnInit(): void {

  }

  addNewUser(){
    this.progressBar.start();
    let model = <CreateSuperAdminCommand>{
      userName: this.ldapUser.userName,
    };

    const subscriber = this.superAdminSvc.createSuperAdmin(model)
    .subscribe({
      next: res=>{
        this.toast.showSuccess("Super admin created");
        this.listOfUserRolesSvc.getUserRoles();
      }, error: e=>{
        if((e.error) && (e.error.message)){
          this.toast.showDanger(e.error.message);
        }
        this.progressBar.complete();
      }, complete:()=>{
        this.progressBar.complete();
        location.reload();
        subscriber.unsubscribe();
      }
    });
  }

  onSerachKeyUp(e: KeyboardEvent){
    if(e.key.toLowerCase() == "enter"){
      this.searchUser()
    }
  }

  searchUser(){
    this.userFound = false;
    this.searching = true;
    const subscriber = this.ldapUserSvc.getLdapIfNotExistsUser(this.search)
    .subscribe({
      next: res=> {
        if(!res?.success){
          this.toast?.showDanger(res.message);
          this.userFound = false;
        }
        else{
          this.ldapUser = res.data as LdaUserModel;
          this.userFound = true;
        }
      }
      , error: e=> {
        this.toast.showDanger("error while processing the request");
        setTimeout(()=> this.searching = false, 1000);

        subscriber.unsubscribe();
      }, complete: ()=> {
        setTimeout(()=> {
          this.searching = false;
        }, 1000);
        subscriber.unsubscribe();
      }
    });
  }


}
