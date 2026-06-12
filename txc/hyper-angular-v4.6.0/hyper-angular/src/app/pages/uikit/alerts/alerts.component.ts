import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

interface Alert {
  type: string;
  message?: string;
  icon?: string;
}

@Component({
  selector: 'app-ui-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {


  pageTitle: BreadcrumbItem[] = [];
  alertVariants: Alert[] = [];
  closableAlerts: Alert[] = [];
  customAlerts: Alert[] = [];
  alertWithLink: Alert[] = [];
  alertWithIcons: Alert[] = [];
  showLiveAlert: boolean = false;

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Alerts', path: '/', active: true }]
    this.alertVariants = [
      {
        type: 'primary',
      },
      {
        type: 'secondary',
      },
      {
        type: 'success',
      },
      {
        type: 'danger',
      },
      {
        type: 'warning',

      },
      {
        type: 'info',

      },
      {
        type: 'light',

      },
      {
        type: 'dark',

      }
    ];

    this.closableAlerts = [
      {
        type: 'primary',
      },
      {
        type: 'secondary',
      },
      {
        type: 'success',
      },
      {
        type: 'danger',
      },
      {
        type: 'warning',

      },
      {
        type: 'info',

      },
      {
        type: 'light',

      },
      {
        type: 'dark',

      }
    ];

    this.customAlerts = [
      {
        type: 'primary',
        message: 'This is a primary alert',
      },
      {
        type: 'secondary',
        message: 'This is a secondary alert',
      },
      {
        type: 'success',
        message: 'This is a success alert',

      },
      {
        type: 'danger',
        message: 'This is a danger alert',

      },
      {
        type: 'warning',
        message: 'This is a warning alert',

      },
      {
        type: 'info',
        message: 'This is an info alert',

      },
      {
        type: 'light',
        message: 'This is a light alert',
      },
      {
        type: 'dark',
        message: 'This is a dark alert',
      }
    ];

    this.alertWithLink = [
      {
        type: 'primary',
      },
      {
        type: 'secondary',
      },
      {
        type: 'success',
      },
      {
        type: 'danger',
      },
      {
        type: 'warning',

      },
      {
        type: 'info',

      },
      {
        type: 'light',

      },
      {
        type: 'dark',

      }
    ];

    this.alertWithIcons = [
      {
        type: 'success',
        message: 'This is a success alert',
        icon: 'dripicons-checkmark'
      },
      {
        type: 'danger',
        message: 'This is a danger alert',
        icon: 'dripicons-wrong'
      },
      {
        type: 'warning',
        message: 'This is a warning alert',
        icon: 'dripicons-warning'
      },
      {
        type: 'info',
        message: 'This is an info alert',
        icon: 'dripicons-information'
      }
    ];

  }

  /**
   * closes alert
   * @param alert alert
   */
  close(alert: Alert) {
    this.closableAlerts.splice(this.closableAlerts.indexOf(alert), 1);
  }

}
