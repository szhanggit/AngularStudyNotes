import { Component, OnInit } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-global-configured-alert',
  templateUrl: './global-configured-alert.component.html',
  styleUrls: ['./global-configured-alert.component.scss'],
  providers: [NgbAlertConfig]
})
export class GlobalConfiguredAlertComponent implements OnInit {

  constructor(alertConfig: NgbAlertConfig) {
    // customize default values of alerts used by this component tree
    alertConfig.type = 'primary';
    alertConfig.dismissible = false;
  }

  ngOnInit(): void {
  }

}
