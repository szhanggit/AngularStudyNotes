import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastTxcService } from '../toast-txc.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts-container-txc.component.html',
  styleUrls: ['./toasts-container-txc.component.css'],
  host: {'class': 'toast-container position-fixed bottom-0 end-0 p-3', 'style': 'z-index: 1200'}
})
export class ToastsContainerTXCComponent implements OnInit {

  constructor(public toastService: ToastTxcService) { }
  isTemplate(toast : any) { return toast.textOrTpl instanceof TemplateRef; }
  ngOnInit(): void {
  }

}
