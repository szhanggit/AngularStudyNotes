import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBatchOrderModalComponent } from './create-batch-order-modal/create-batch-order-modal.component';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { Subscription, filter } from 'rxjs';
import { UtilityService } from '../../services/utility.service';
import { BatchDomainsEnum } from '../../enums/batch-domains.enum';
import { StatusEnum } from '../../enums/status.enum';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-batch-order-list',
  templateUrl: './batch-order-list.component.html',
  styleUrls: ['./batch-order-list.component.scss'],
})
export class BatchOrderListComponent implements OnDestroy, AfterViewInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  actionButtons = [
    {
      buttonText: 'Create batch order',
      buttonClass: 'btn-primary',
      buttonAction: () => this.openModalWindow(),
    },
  ];

  selectedView: string = '';
  statuses = StatusEnum;
  toastSubscriptions$: Subscription[] = [];

  constructor(
    private modalService: NgbModal,
    private utilityService: UtilityService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.initializeToastSubscriptions();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.selectedView = '';
      });
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribeToastSubscriptions(this.toastSubscriptions$);
  }

  initializeToastSubscriptions() {
    this.toastSubscriptions$.push(
      this.utilityService.listenToUploadSuccess(
        this.toast,
        BatchDomainsEnum.OrderList
      )
    );

    this.toastSubscriptions$.push(
      this.utilityService.listenToErrorMessage(this.toast)
    );
  }

  openModalWindow() {
    this.modalService.open(CreateBatchOrderModalComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });
  }

  handleSelectedViewChange(selectedView: string) {
    this.selectedView = selectedView;
  }
}
