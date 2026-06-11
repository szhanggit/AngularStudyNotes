import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastTxcService } from './toast-txc.service'

@Component({
  selector: 'ngbd-toast-global',
  templateUrl: './bootstrap-txc.component.html',
  styleUrls: ['./bootstrap-txc.component.css']
})
export class BootstrapTXCComponent implements OnInit, OnDestroy {

  constructor(public toastService: ToastTxcService) { }

  ngOnInit(): void {
  }

  showStandard(message: string) {
    this.toastService.show(message);
  }

  showSuccess(message: string) {
    this.toastService.show(message, { classname: 'bg-success text-light' });
  }

  showDanger(dangerTpl: any) {
    console.log('asdfasdfasdf');
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light' });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
