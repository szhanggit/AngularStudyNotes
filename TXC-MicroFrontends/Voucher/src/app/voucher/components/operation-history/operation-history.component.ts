import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionTypeEnum } from '../../enum/action-type-enum';

@Component({
  selector: 'app-operation-history',
  templateUrl: './operation-history.component.html',
  styleUrls: ['./operation-history.component.scss']
})
export class OperationHistoryComponent implements OnInit {
  list: any[] = [
    {
      actionTime: '2021/12/28 11:59:59 PM',
      actionType:  ActionTypeEnum.UpdateEmail,
      result: 'Success',
      operator: 'Miller',
      memo: '',
    },
    {
      actionTime: '2021/12/28 11:59:59 PM',
      actionType:  ActionTypeEnum.UpdateSMS,
      result: 'Success',
      operator: 'Miller',
      memo: '',
    },
    {
      actionTime: '2021/12/28 11:59:59 PM',
      actionType:  ActionTypeEnum.ResendEmail,
      result: 'Success',
      operator: 'Miller',
      memo: '',
    },
    {
      actionTime: '2021/12/28 11:59:59 PM',
      actionType:  ActionTypeEnum.ResendSMS,
      result: 'Success',
      operator: 'Miller',
      memo: '',
    },
  ];
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    
  }

  clearList() {
    this.list = [];
  }

}
