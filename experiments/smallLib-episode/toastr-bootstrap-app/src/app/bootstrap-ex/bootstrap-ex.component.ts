import { Component, OnInit, inject, OnDestroy, TemplateRef } from '@angular/core';
import { ToastServiceService } from './toast-service.service';
import { ToastsContainerExComponent } from './toasts-container-ex/toasts-container-ex.component';

@Component({
  selector: 'app-bootstrap-ex',
  templateUrl: './bootstrap-ex.component.html',
  styleUrls: ['./bootstrap-ex.component.css']
})
export class BootstrapExComponent implements OnInit, OnDestroy  {
  _toastService: ToastServiceService;
  constructor(toastService: ToastServiceService) { 
    this._toastService = toastService;
  }

  ngOnInit(): void {
  }

	showStandard(template: TemplateRef<any>) {
		this._toastService.show({ template });
	}

	showSuccess(template: TemplateRef<any>) {
		this._toastService.show({ template, classname: 'bg-success text-light', delay: 10000 });
	}

	showDanger(template: TemplateRef<any>) {
		this._toastService.show({ template, classname: 'bg-danger text-light', delay: 15000 });
	}

  ngOnDestroy(): void {
		this._toastService.clear();
	}
}
