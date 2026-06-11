import { Component, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from './system-exception/toaster.service';
import { BootstrapTXCComponent } from './bootstrap-txc/bootstrap-txc.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, AfterViewInit{
  title = 'template-app';
  @ViewChild(BootstrapTXCComponent) toast!: BootstrapTXCComponent;

  constructor(private router: Router, private readonly toasterSrv : ToasterService){

  }

  CreateRole(){
    const state = { id: 1, name: 'Example' };
    this.router.navigate(['/role'], { state });
  }

  ngAfterViewInit(): void {
    this.toasterSrv.toaster.next(this.toast);
  }

  ngOnDestroy(): void {

  }
}
