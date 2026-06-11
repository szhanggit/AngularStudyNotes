import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { BootstrapTXCComponent } from '../bootstrap-txc/bootstrap-txc.component';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit, AfterViewInit {
  @ViewChild(BootstrapTXCComponent) toast!: BootstrapTXCComponent;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log(`State information is: ${history.state.name}`);
    this.toast.showSuccess('Role created successfully!');


    /*this.createAdmin = history.state.createAdmin != null ? history.state.createAdmin : false;
    this.editAdmin = history.state.editAdmin != null ? history.state.editAdmin : false;

    if (this.createAdmin) {
      this.toast.showSuccess('Admin created!');
      this.createAdmin = false;
    }

    if (this.editAdmin) {
      this.toast.showSuccess('Admin updated!');
      this.editAdmin = false;
    }*/
  }
}
