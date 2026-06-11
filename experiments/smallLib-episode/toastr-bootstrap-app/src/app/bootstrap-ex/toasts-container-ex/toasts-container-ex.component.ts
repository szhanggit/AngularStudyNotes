import { Component, OnInit, inject } from '@angular/core';
import { ToastServiceService } from '../toast-service.service';

@Component({
  selector: 'app-toasts-ex',
  templateUrl: './toasts-container-ex.component.html',
  styleUrls: ['./toasts-container-ex.component.css'],
  host: {class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200'}
})
export class ToastsContainerExComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  toastService = inject(ToastServiceService);
}
