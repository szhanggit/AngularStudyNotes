import { Component, OnInit, ElementRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { BootstrapTXCComponent } from '../bootstrap-txc/bootstrap-txc.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-txc-form',
  templateUrl: './txc-form.component.html',
  styleUrls: ['./txc-form.component.css']
})
export class TxcFormComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild(BootstrapTXCComponent) toast!: BootstrapTXCComponent;
  @ViewChild('editHistoryModal', { static: true }) editHistoryModal: ElementRef = {} as ElementRef;
  private ngUnsubscribe = new Subject<void>();
  constructor() { }

  ngOnInit(): void {
  }

  TriggerToast(){
    this.toast.showSuccess('Admin updated!');
  }

  TriggerDangerToast(){
    //this.toast.showDanger(this.editHistoryModal);
    this.toast.showDanger('SoS');
  }

  ngAfterViewInit(): void {
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
