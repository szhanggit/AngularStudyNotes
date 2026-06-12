import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-self-closing-alert',
  templateUrl: './self-closing-alert.component.html',
  styleUrls: ['./self-closing-alert.component.scss']
})
export class SelfClosingAlertComponent implements OnInit {

  private _success = new Subject<string>();
  show: boolean = true;

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert!: NgbAlert;

  constructor () { }

  ngOnInit(): void {

    this._success.subscribe(() => this.show = true);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });

  }

  public showMessage() {
    this._success.next('');
  }

}
